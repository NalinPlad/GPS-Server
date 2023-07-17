sudo apt-get -qq -y install openssl;
sudo openssl req \
    -new \
    -newkey rsa:4096 \
    -days 365 \
    -nodes \
    -x509 \
    -subj "/C=US/ST=CA/L=BERKELEY/O=RADWATCH/CN=DOSENET" \
    -keyout dosenet.key \
    -out dosenet.cert