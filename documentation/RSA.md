## Generating an RSA Private Key Using OpenSSL

You can generate an RSA private key using the following command:
    
```bash
openssl genrsa -out private-key.pem 3072
```

In this example, I have used a key length of 3072 bits. While 2048 is the minimum key length supported [by specifications such as JOSE](https://www.scottbrady91.com/jose/jwts-which-signing-algorithm-should-i-use), it is recommended that you use 3072. This gives you 128-bit security. This command also uses an exponent of 65537, which you’ve likely seen serialized as “AQAB”.
    
This gives you a PEM file containing your RSA private key, which should look something like the following:

```bash
-----BEGIN RSA PRIVATE KEY-----
MIIG4wIBAAKCAYEA1MSdsaPH2ShtjOo4c02+DbYcTdwUBLY+vNSXr2tV8/jGU059
Jak9CA7VSlKR/fik18D7Lq1beLjW56kV4Xvm3qmpxOc3eNGmj8dqtO0G3Lp1FAZz
xlu2SZsHmmVq9isZcN70apkwlDgIZ11NVIq/1iXzr0pIRMKkMNHTGBGBkYOrIcgd
H2elvIqfiit6Gts/zho4YCjgyn/r3Vgy/jCu6VbfwE9xVY/DB4srD5LrZMabRzN2
YwSTI+sRqpbt7I7nZ6o8CuyqHDLjbO9VzE0povBshTfoyog9XGcQHwTmWn4bdnsh
2I1x3gQpaqxdRs4vnKmXJ9GvC/sYla0GYXyDecpgjITqx3QA6aKx9+EVh/o6owYT
HXaToVkP7U5m8cqaloQFfA8HLsGDg9A0QaMtixnX7KtT/ZvKFMcazRJ1GX42Uaeu
O1opZKtjBHLtmaPadNeZdD77VytwY2UHeW5QSnfpos7IxUTATpd6KTWUV3snVQny
iltCI1BHJC01sWePAgMBAAECggGAEG1tz31ZvMaGTs72tNBX0C8zWD+ZvBNmHKY9
X+nlpQScK2pv9yxt7eVXSnm9k+JSt+XKfvwbh+KdlR1U9yfd12s6FF3VxppJReib
sIRsdzZeO8GTxsjl9iDmIWGbNI53VGOic2iIe6kn3PMzOUfNL/eWLP6LPePZUXuh
1MXlPxrvZ5hPx1D1Vu1NDBn3P4OWFY+osqP1Vy0xRNG+fim8F4ABnpODqJuE71wr
YvRxAELlUkYC6fo8chWAM6+bhxwxVaGiIKluikmVJtt0/aAcKR6fUogGfcumRGPp
HzFRDZBVdLmVwbpVrfCbULP7wYk2A5QMu2skAlZSYtyWJbBRXvgweEXepJaXC6FW
atD5ypi1kSX9K71BRM7DKrmY2/RsyR6Y8a2PdiOHB5MNYKoeH5o2k0htsV2zUspo
4nER4AB5a5fEysGg3yCST+m2q7UOBvcB0LblE/0sNuOGtCNPmtChdZxspsVRm2ID
XkKrljy+cdOsxZ0iVcvGhyJRhlCBAoHBAOn6KMfbB11uliVyouFfV5ZoiWPeIXbF
wkAnev+8kF/GmYU7bAFAhRg2qzwqTVlC2eeG+dHKgr9+xHjsTOIoLB/5jPgcIfY9
l0lZ9LmNwwvI3wg6XWnwQf9X97YZ1E1A3TpBU5XNzTo7hVtZgHDIf4ufB5sDhZ1S
nXf/+uBe7gJMMnizpq/tqr+0oPJd4uac1rTp2wsFx6MJjOR8kijZOnr3SdKNU3xo
shZWlRHy9qCjftxTIuOFSxdEZhJUm87w8QKBwQDoy2hYI0hMn3+lwu30lk4+LGSW
9ij7AzyTVcRR9FbYciTMQ24IrK020A9rDXkVkJ6FeTbCtT3UkFOlz3JZkEpvY/qd
Mf8hfd5IO68R1Z5lZpLCFAqcIRUE9l7En9nMiuqdDPZJfhUjhlajzhQotYEv1Fqq
WDmK0IaklSfGJt0LVsZSuINErHaC5HjJocL86Cqao9a1rxgJA7maCfirwABAafHc
6OhFuW5Pi6IXj9QbM7PgbGjIIXPDFfs7FkqF4H8CgcEAu0MACJSAXIL5oJcTTZVl
IHgiHc/WsJyuT3JJuwxL8Juem0dntcjRvQNkIQ8qQNqEVA1vPDz8UA9BaBaXohnM
1vp/nMPHWrEIuChK+YdAJ9poxskPoo4sBBV/qDsb84iKhulp4GeKbaTdorMLXTja
/AAXsjUrZzKL3VL+kzzm+OfLLVd7fSqWkkAa4F/MDg5QuRLBwRyrHw2xud0Jja/u
YiQw7Vc3Dkcs4TwCqw7t3Lt9+RCAx+ASrViM6PbWjNXBAoHAa0fiDEwmM3mFn+RX
ONJTuH9I0/EZLaRuNA/ga0xJAXKI1sF0YfcB1DLKCDGrTW7aPvR/cfeISP9CLTWO
owvF4dOXWP4Db3HMEEnBAl0Jo/1DQMFvqkfsod7QCZkJDCQwvrOMhI3gPADayJ5d
1+zdXidkqQADdJ9ojUxXig+66lDREKoLhIheDTAxIeq0K0zq5Vz/w7avQug+jmht
+uh+tTCdz4peEFPGLE5TIrybqPWIvbH4D9KqwIrOvoolSdENAoHAaa+n0ZXGovFy
Hjk02KSinY80b0VzOKKXCh3vc5+2WAS9Ar4no7Cobt5QhKA0GtYpLSCmUFRvsZ1P
Gemb/FH+yC5nLvKaDOpHktZONIARP8e9R1ku9o+9lOFAIU0MYHx0Ep0y4XWgMrTp
UuP3ai7zn++ag7Lu1QEm5pQAd2n+zMuKZbBISVA9fPbC9RkJX66E4zVbsEUnDDBD
9Rlu+3Dc0LwSjtAxXPDInmEh2mp3O/aZtMPVUPgDA4Ig7GbQC6W/
-----END RSA PRIVATE KEY-----
```

### Creating an RSA Public Key from a Private Key Using OpenSSL

Now that you have your private key, you can use it to generate another PEM file, containing only your public key.
    
```bash
openssl rsa -in private-key.pem -pubout -out public-key.pem
```
    
This should give you another PEM file, containing the public key:
    
```bash
-----BEGIN PUBLIC KEY-----
MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEA1MSdsaPH2ShtjOo4c02+
DbYcTdwUBLY+vNSXr2tV8/jGU059Jak9CA7VSlKR/fik18D7Lq1beLjW56kV4Xvm
3qmpxOc3eNGmj8dqtO0G3Lp1FAZzxlu2SZsHmmVq9isZcN70apkwlDgIZ11NVIq/
1iXzr0pIRMKkMNHTGBGBkYOrIcgdH2elvIqfiit6Gts/zho4YCjgyn/r3Vgy/jCu
6VbfwE9xVY/DB4srD5LrZMabRzN2YwSTI+sRqpbt7I7nZ6o8CuyqHDLjbO9VzE0p
ovBshTfoyog9XGcQHwTmWn4bdnsh2I1x3gQpaqxdRs4vnKmXJ9GvC/sYla0GYXyD
ecpgjITqx3QA6aKx9+EVh/o6owYTHXaToVkP7U5m8cqaloQFfA8HLsGDg9A0QaMt
ixnX7KtT/ZvKFMcazRJ1GX42UaeuO1opZKtjBHLtmaPadNeZdD77VytwY2UHeW5Q
Snfpos7IxUTATpd6KTWUV3snVQnyiltCI1BHJC01sWePAgMBAAE=
-----END PUBLIC KEY-----
```

### Creating an RSA Self-Signed Certificate Using OpenSSL

Now that you have a private key, you can use it to generate a self-signed certificate. This is not required, but it allows you to use the key for server/client authentication, or gain X509 specific functionality in technologies such as JWT and SAML.
    
```bash
openssl req -new -x509 -key private-key.pem -out cert.pem -days 360
```
    
This will again generate yet another PEM file, this time containing the certificate created by your private key:
    
```bash
-----BEGIN CERTIFICATE-----
MIIEazCCAtOgAwIBAgIUU6wl3KK4lP7EIr4YtJZDkv/GuLUwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yMTAxMzAxMDI4MzlaFw0yMjAx
MjUxMDI4MzlaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggGiMA0GCSqGSIb3DQEB
AQUAA4IBjwAwggGKAoIBgQDUxJ2xo8fZKG2M6jhzTb4NthxN3BQEtj681Jeva1Xz
+MZTTn0lqT0IDtVKUpH9+KTXwPsurVt4uNbnqRXhe+beqanE5zd40aaPx2q07Qbc
unUUBnPGW7ZJmweaZWr2Kxlw3vRqmTCUOAhnXU1Uir/WJfOvSkhEwqQw0dMYEYGR
g6shyB0fZ6W8ip+KK3oa2z/OGjhgKODKf+vdWDL+MK7pVt/AT3FVj8MHiysPkutk
xptHM3ZjBJMj6xGqlu3sjudnqjwK7KocMuNs71XMTSmi8GyFN+jKiD1cZxAfBOZa
fht2eyHYjXHeBClqrF1Gzi+cqZcn0a8L+xiVrQZhfIN5ymCMhOrHdADporH34RWH
+jqjBhMddpOhWQ/tTmbxypqWhAV8DwcuwYOD0DRBoy2LGdfsq1P9m8oUxxrNEnUZ
fjZRp647Wilkq2MEcu2Zo9p015l0PvtXK3BjZQd5blBKd+mizsjFRMBOl3opNZRX
eydVCfKKW0IjUEckLTWxZ48CAwEAAaNTMFEwHQYDVR0OBBYEFPYvmUGJ7X198k+e
Rag8kiWoWDi6MB8GA1UdIwQYMBaAFPYvmUGJ7X198k+eRag8kiWoWDi6MA8GA1Ud
EwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggGBABi/YG+PDTYMFjU/qwFYddCp
aEMV5qi0mvh6N3eApcaQTlSE259QsyADCmKn7/ZD5sPJUHbo4x3tUIqwhij2Cdv6
TEhwgLOugiNDQOSleD6cmF0A+jUNT1cVgtQYR4KcWdDDQPkMOWgBs8hMU1H9WEI5
XWBvR1LkM6VXCbj3s2Ammmu5+zh53NOcViRhb3idB5wsAZJmLr+Ob5L0dC4Ohl2U
gx+Ia9GGNfS4I+0nKSigWzQc+WxFFxVrjRTtTHT+tb2g3nQMH6pQ8Ipn7VBJyMbK
DLUM93xqDnhrGtwMnra3T0NRJcFJDQg4hGhuuUpX4Y/81NaSttxawe3SDjcYT+AF
Al9VntdeSvyeEJRWd6QZPA3S24W1pj/IutbM8El0w4N9408u64DQR71k41dlO++K
DL/g3TP5Qffg/jZ+YKb1ssgfMYmFyUYfs/aXV9lJbqGBautNmMqzARXarlERbXIj
38D4N6szhvnhOq6KO2sl30JxUm1LI9TsyQyYWqel+A==
-----END CERTIFICATE-----
```

You could leave things there, but often, when working on Windows, you will need to create a PFX file that contains both the certificate and the private key for you to export and use.
    
You can do this using OpenSSL’s pkcs12 command:
    
```bash
openssl pkcs12 -export -inkey private-key.pem -in cert.pem -out cert.pfx
```
    
OpenSSL will ask you to create a password for the PFX file. Feel free to leave this blank.

### Convert PEM key to PKCS8 format

```bash
openssl pkcs8 \
-topk8 \
-inform PEM \
-outform PEM \
-in private-key.pem \
-out private-pkcs8.pem \
-nocrypt
```

### OpenSSL RSA Cheat Sheet

```bash
# generate a private key with the correct length
openssl genrsa -out private-key.pem 3072

# generate corresponding public key
openssl rsa -in private-key.pem -pubout -out public-key.pem

# optional: create a self-signed certificate
openssl req -new -x509 -key private-key.pem -out cert.pem -days 360

# optional: convert pem to pfx
openssl pkcs12 -export -inkey private-key.pem -in cert.pem -out cert.pfx

```
