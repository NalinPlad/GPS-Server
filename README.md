# GPS Server
Archive of original GPS Service. This server was implemented in the [mobile dosenet firmware](https://github.com/NalinPlad/dosenet-raspberrypi-1) by me


### How to run
1. Clone the repo
2. Run `chmod +x ./gensslcert.sh`
3. Run `./gensslcert.sh` (uses openssl to generate an ssl cert)
4. Run `pip3 install -r requirements.txt`
5. Run `python3 server.py`
6. Then you can access the client page at `https://localhost/www/` or from your IP address on another device
7. Fix all the error you see (good luck)
