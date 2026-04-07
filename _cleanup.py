import os, glob
d = r'C:\Users\USER-PC\Desktop\onlyAI'
for f in glob.glob(os.path.join(d, '_*.py')) + glob.glob(os.path.join(d, '_*.txt')):
    try:
        os.remove(f)
        print(f'removed {f}')
    except: pass
