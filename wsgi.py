##
## This code is part of the Code Genome Framework.
##
## (C) Copyright IBM 2023.
##
## This code is licensed under the Apache License, Version 2.0. You may
## obtain a copy of this license in the LICENSE.txt file in the root directory
## of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
##
## Any modifications or derivative works of this code must retain this
## copyright notice, and modified files need to carry a notice indicating
## that they have been altered from the originals.
##
from dotenv import load_dotenv
import logging
from flask import Flask, send_from_directory, render_template, request, Response
import os, requests
app = Flask(__name__)
logging.basicConfig(filename='./scantool-hybrid.log', level=logging.DEBUG,
                                 format='%(asctime)s, %(name)s, %(levelname)s, %(message)s',
                                 datefmt='%m/%d/%Y %H:%M:%S', force=True)
logger = logging.getLogger('codegenome_ui')
load_dotenv()
CG_HOST = os.environ.get('CG_HOST')
directory = os.getcwd()+ '/static'
INDEXHTML = 'index.html'
logger.info('info startup')
logger.debug('debug startup')

@app.route('/')
def index():
  return render_template(INDEXHTML)

@app.route('/job/<id>/<sha256>/<internal_jobid>')
def job():
  return render_template(INDEXHTML)

@app.route('/history')
def history():
  return render_template(INDEXHTML)

@app.route('/home')
def home():
  return render_template(INDEXHTML)

@app.route('/search/<sha256>')
def searchsha256(sha256):
  return render_template(INDEXHTML)

@app.route('/admin/<sha256>')
def adminsearch(sha256):
  return render_template(INDEXHTML)

@app.route('/search')
def search():
  return render_template(INDEXHTML)

@app.route('/compare/<sha256_p1>/<sha256_p2>', methods=['GET'])
def comparesha256(sha256_p1, sha256_p2):
  logger.debug('/compare/<sha256_p1>/<sha256_p2>')
  return render_template(INDEXHTML)

@app.route('/compare')
def compare():
  return render_template(INDEXHTML)
  
@app.route('/api/v1/add/file', methods=['POST'])
@app.route('/api/v1/search/by_id', methods=['POST'])
@app.route('/api/v1/compare/files/by_file_ids', methods=['POST'])
@app.route('/api/v1/search/gene', methods=['POST'])
def rd2_cg():
  logger.debug('API route /api invoking proxy request to %s', CG_HOST)
  logger.info('CG_HOST= %s', CG_HOST)
  res = requests.request(
    method = request.method,
    url    = request.url.replace(request.host_url, f'{CG_HOST}/'),
    headers= {k:v for k,v in request.headers if k.lower() != 'host'},
    data   = request.get_data(),
    cookies= request.cookies,
    allow_redirects=False          
  )
  exclude_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
  headers  = [
        (a,b) for a,b in res.raw.headers.items()
        if a.lower() not in exclude_headers
  ]
  response = Response(res.content, res.status_code, headers)
  return response

@app.route('/api/v1/status/job/<job_id>', methods=['GET'])
def get_job_status(job_id):
  logger.debug('API route /api invoking proxy request to %s', CG_HOST)
  logger.info('CG_HOST= %s', CG_HOST)
  res = requests.request(
    method = request.method,
    url    = request.url.replace(request.host_url, f'{CG_HOST}/'),
    headers= {k:v for k,v in request.headers if k.lower() != 'host'},
    data   = request.get_data(),
    cookies= request.cookies,
    allow_redirects=False          
  )
  exclude_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
  headers  = [
        (a,b) for a,b in res.raw.headers.items()
        if a.lower() not in exclude_headers
  ]
  response = Response(res.content, res.status_code, headers)
  return response

@app.route('/<file>.js')
def file1(file):
  logger.debug('Sending file %s from directory %s...', file, directory)
  return send_from_directory(directory=directory, path=file)


if __name__ == '__main__':
  app.run(debug=True, threaded=True, host='0.0.0.0')