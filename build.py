
#Commands I need:
# copy the appropriate js file to index.js
# go to build folder, find the js and css files, move them to main folder
#   and rename
# make the html file, put it in the main folder

#Let the first argument be the location of the js file (within src/), let the 
# second argument be the subdirectory of main to put the files.

import os
import sys

if len(sys.argv) < 2:
    print("No arguments specified")
    exit()

jsfile = sys.argv[1];
if len(sys.argv) < 3: outdir = ""
else: 
    outdir = sys.argv[2]
    if outdir[-1] != "/": outdir += "/"

os.system("cp src/" + jsfile + " src/index.js")
os.system("npm run build")

#Go into build, find the js file
def find_by_extension(path, extension):
    if path[-1] != "/": path += "/";
    if(not os.path.isdir(path)): return []
    l = os.listdir(path)
    output = []
    for s in l: 
        if s[-len(extension):] == extension: output.append(path + s)
    return output

jsoutput = find_by_extension("build/static/js/", ".js")[0]
if "main" not in os.listdir("."): os.mkdir("main")
if len(outdir) > 0 and outdir[0:-1] not in os.listdir("./main"): 
    os.mkdir("main/" + outdir)
os.system("mv " + jsoutput + " main/" + outdir + "index.js")
csslist = find_by_extension("build/static/css/", ".css")
if len(csslist) > 0: 
    os.system("mv " + csslist[0] + " main/" + outdir + "index.css")
    maplist = find_by_extension("build/static/css/", ".map")
    os.system("mv " + maplist[0] + " main/" + outdir + maplist[0][17:])
maplist = find_by_extension("build/static/js/", ".map")
os.system("mv " + maplist[0] + " main/" + outdir + maplist[0][16:])
with open("main/" + outdir + "index.html", "w") as f:
    f.write("<!DOCTYPE html>\n")
    f.write("<html lang='en'>\n")
    f.write("  <meta charset='utf-8'/>\n")
    f.write("  <meta name='viewport' content='width=device-width,initial-scale=1'/>\n")
    f.write("  <meta name='theme-color' content='#000000'/>\n")
    f.write("  <script defer='defer' src='./index.js'></script>\n")
    if len(csslist) > 0:
        f.write("  <link href='./index.css' rel='stylesheet'>\n")
    f.write("</head>\n");
    f.write("<body>\n");
    f.write("  <noscript>You need to enable JavaScript to run this app.</noscript>\n")
    f.write("  <div id='root'></div>\n")
    f.write("</body>\n")
    f.write("</html>")

os.system("rm src/index.js")
