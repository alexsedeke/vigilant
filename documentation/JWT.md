# Using of JWT 

To enhance the security we use the JOSE package to encript and decript JWT Tokens.

## Should I use HS256 and ES256 for authentication?

We strongly recommend to use ES256, which is an asymmetric algorithm. These is more secure then a symmetric algorithm like HS256.

Here for we need a private and public certificate.

## Generating a private EC key

Generate an EC private key, of size 256, and output it to a file named key.pem:
    
```bash
openssl ecparam -name prime256v1 -genkey -noout -out key.pem
```
    
```bash
openssl ec -in key.pem -pubout -out public.pem
> read EC key
> writing EC key
```
    
After running these two commands you end up with two files: key.pem and public.pem. 

```bash
openssl pkcs8 \
-topk8 \
-inform PEM \
-outform PEM \
-in key.pem \
-out private-pkcs8.pem \
-nocrypt
```
