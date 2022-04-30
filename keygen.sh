echo 'Enter personnel Name: '
read name
echo 'Enter attributes: '
read attributes

echo 'Generating private key from given attributes...'
keyname="${name}_priv_key"
cpabe-keygen -o $keyname ./cpabe_keys/pub_key ./cpabe_keys/master_key $attributes
sudo mv $keyname cpabe_keys
echo 'DONE.'
