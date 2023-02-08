import hashlib

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from pycrypto.zokrates_pycrypto.eddsa import PrivateKey, PublicKey
from pycrypto.zokrates_pycrypto.utils import to_bytes


ROUNDS = 100


def sha256(*args):
    p = b"".join(to_bytes(_) for _ in args)
    digest = hashlib.sha256(p).digest()
    return digest


def write_registration_for_zokrates_cli(pk, sig, msg, h, path):
    sig_R, sig_S = sig
    args = [sig_R.x, sig_R.y, sig_S, pk.p.x.n, pk.p.y.n]
    args = " ".join(map(str, args))

    M0 = msg.hex()[:64]
    M1 = msg.hex()[64:]
    b0 = [str(int(M0[i:i+8], 16)) for i in range(0,len(M0), 8)]
    b1 = [str(int(M1[i:i+8], 16)) for i in range(0,len(M1), 8)]
    args = args + " " + " ".join(b0 + b1)

    h0 = h.hex()[:32]
    h1 = h.hex()[32:]
    args = args + " " + str(int(h0, 16)) + " " + str(int(h1, 16))

    with open(path, "w+") as file:
        for l in args:
            file.write(l)


def write_publication_for_zokrates_cli(sig, h, path):
    sig_R, sig_S = sig
    args = [sig_R.x, sig_R.y, sig_S]
    args = " ".join(map(str, args))

    h0 = h.hex()[:32]
    h1 = h.hex()[32:]
    args = args + " " + str(int(h0, 16)) + " " + str(int(h1, 16))

    with open(path, "w+") as file:
        for l in args:
            file.write(l)


if __name__ == "__main__":
    for i in range(0, ROUNDS):
        # claim
        raw_msg = f"{i}"  # claim
        msg = hashlib.sha512(raw_msg.encode("utf-8")).digest()  # get digest of claim

        # (pk, sk) of institute
        sk = PrivateKey.from_rand()
        pk = PublicKey.from_private(sk)

        # sign
        # JWT = (sig.R.x, sig.R.y, sig.S)  # JWT: header, payload, signature
        sig = sk.sign(msg)

        # is_verified = pk.verify(sig, msg)
        # print(is_verified)

        # H(JWT)
        sig_R, sig_S = sig
        h = sha256(0, sig_R.x, sig_R.y, sig_S)

        # save args
        r_path = f"inputs/registration/{i}.txt"
        write_registration_for_zokrates_cli(pk, sig, msg, h, r_path)

        p_path = f"inputs/publication/{i}.txt"
        write_publication_for_zokrates_cli(sig, h, p_path)
