import hashlib

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from pycrypto.zokrates_pycrypto.eddsa import PrivateKey, PublicKey
from pycrypto.zokrates_pycrypto.field import FQ
from pycrypto.zokrates_pycrypto.utils import write_signature_for_zokrates_cli


if __name__ == "__main__":

    raw_msg = "This is my secret message"
    msg = hashlib.sha512(raw_msg.encode("utf-8")).digest()

    # key = FQ(1997011358982923168928344992199991480689546837621580239342656433234255379025)
    # sk = PrivateKey(key)
    sk = PrivateKey.from_rand()

    sig = sk.sign(msg)

    pk = PublicKey.from_private(sk)
    # is_verified = pk.verify(sig, msg)
    # print(is_verified)

    path = f"inputs/{sk}.txt"
    write_signature_for_zokrates_cli(pk, sig, msg, path)
