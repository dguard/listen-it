import os

ROOT_FOLDER = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(ROOT_FOLDER, 'upload')
RUNTIME_FOLDER = os.path.join(ROOT_FOLDER, 'runtime')
ALLOWED_EXTENSIONS = ['midi', 'mid']