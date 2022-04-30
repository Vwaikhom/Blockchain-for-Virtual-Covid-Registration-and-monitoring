from distutils import core
from distutils.debug import DEBUG
from fileinput import filename
import os
from flask import Flask, current_app, request, jsonify, send_file, send_from_directory, abort
from flask_restful import Resource, Api, reqparse
from itsdangerous import json
from werkzeug.utils import secure_filename
from flask_cors import CORS
import subprocess
import ipfshttpclient

POLICY = ("(sysadmin) or "
              "(data_analyst and covid_nurse) or "
              "(attending_physician)"
              )

UPLOAD_FOLDER = "/home/vishal/Desktop/projects/ABE/test"

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app)

api = ipfshttpclient.connect('/dns/ipfs.infura.io/tcp/5001/https')

ALLOWED_EXTENSIONS = set(['txt','pdf']) 

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods = ['POST'])
def upload_file():
    if 'file' not in request.files:
        resp = jsonify({'message' : 'No file in the request'})
        resp.status_code = 400
        return resp
    
    file = request.files['file']
    
    if file.filename == '':
        resp = jsonify({'message' : 'No file selected for uploading'})
        resp.status_code = 400
        return resp

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        temp = file.filename.split(".")[0]
        EncryptedFileName = temp + ".encrypted.cpabe"
        cmmd = ['cpabe-enc' , '-o', EncryptedFileName, './cpabe_keys/pub_key', file.filename, POLICY]
        subprocess.call(cmmd)
        #print (file.filename)
        ipfsAddFile = api.add(EncryptedFileName)
        #print(ipfsAddFile['Hash'])
        resp = jsonify({'message' : 'File successfully uploaded',
        'Name': ipfsAddFile['Name'], 'Hash': ipfsAddFile['Hash'], 'Size': ipfsAddFile['Size']})
        resp.status_code = 201
        return resp
        
    else:
        resp = jsonify({'message': 'Allowed file types are txt and pdf'})
        resp.status_code = 400
        return resp


@app.route('/download', methods=['POST'])
def download_file():
    try:
        hash = request.form['hash']
        filename = str(hash) + '.pdf'

        if os.path.exists(filename):
            return send_file(filename, as_attachment=True)
        else:
            api.get(hash)
            print(filename)
            cmmd = ['cpabe-dec', '-o', filename, './cpabe_keys/pub_key', 'cpabe_keys/Kevin_priv_key', hash]
            subprocess.call(cmmd)
            #uploads = os.path.join(current_app.root_path, app.config['UPLOAD_FOLDER'])
            #return send_from_directory(directory=uploads, filename=hash, as_attachment=True)
            return send_file(filename, as_attachment=True)
    except Exception as e:
        abort(404)
if __name__ == '__main__':
    app.debug=True  
    app.run("0.0.0.0")
