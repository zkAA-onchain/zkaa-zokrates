import numpy as np
from os import listdir
from os.path import isfile, join
import subprocess
import time


R_ARGS_PATH = "./inputs/registration/"
P_ARGS_PATH = "./inputs/publication/"

R_WITNESS_PATH = "./witnesses/registration/"
P_WITNESS_PATH = "./witnesses/publication/"

R_PROOFS_PATH = "./proofs/registration/"
P_PROOFS_PATH = "./proofs/publication/"

R_EXECUTE = "computes/registration"
P_EXECUTE = "computes/publication"

R_PROVING_KEY = "computes/r_proving.key"
P_PROVING_KEY = "computes/p_proving.key"

METHOD = "g16"  # g16, gm17, marlin


r_args = [f for f in listdir(R_ARGS_PATH) if isfile(join(R_ARGS_PATH, f))]
p_args = [f for f in listdir(P_ARGS_PATH) if isfile(join(P_ARGS_PATH, f))]

t_r_witness = []
t_p_witness = []

t_r_proof = []
t_p_proof = []


# create r witness
# create r proof
for i, args in enumerate(r_args):
    command = f"cat {R_ARGS_PATH}{args} | xargs zokrates compute-witness -i {R_EXECUTE} -o {R_WITNESS_PATH}{i} -a"
    start = time.time()
    subprocess.run(command, shell=True, stdout=subprocess.DEVNULL)
    end = time.time()
    t_r_witness.append(end - start)

    command = f"zokrates generate-proof -i {R_EXECUTE} -p {R_PROVING_KEY} -s {METHOD} -w {R_WITNESS_PATH}{i} -b ark -j {R_PROOFS_PATH}{i}.json"
    start = time.time()
    subprocess.run(command, shell=True, stdout=subprocess.DEVNULL)
    end = time.time()
    t_r_proof.append(end - start)


# create p witness
# create p proof
for i, args in enumerate(p_args):
    command = f"cat {P_ARGS_PATH}{args} | xargs zokrates compute-witness -i {P_EXECUTE} -o {P_WITNESS_PATH}{i} -a"
    start = time.time()
    subprocess.run(command, shell=True, stdout=subprocess.DEVNULL)
    end = time.time()
    t_p_witness.append(end - start)

    command = f"zokrates generate-proof -i {P_EXECUTE} -p {P_PROVING_KEY} -s {METHOD} -w {P_WITNESS_PATH}{i} -b ark -j {P_PROOFS_PATH}{i}.json"
    start = time.time()
    subprocess.run(command, shell=True, stdout=subprocess.DEVNULL)
    end = time.time()
    t_p_proof.append(end - start)


def minMaxAvgSdMed(a: np.array):
    return f"Min {min(a):8.4f}, Max {max(a):8.4f}, Avg {(np.average(a)):8.4f} (SD: {a.std():8.4f}), MED {np.median(a):8.4f}"


# benchmark results
print(f"w_r: {minMaxAvgSdMed(np.array(t_r_witness))}")
print(f"w_p: {minMaxAvgSdMed(np.array(t_p_witness))}")
print(f"p_r: {minMaxAvgSdMed(np.array(t_r_proof))}")
print(f"p_p: {minMaxAvgSdMed(np.array(t_p_proof))}")
