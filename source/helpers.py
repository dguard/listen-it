import os
import config


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in config.ALLOWED_EXTENSIONS


def save_file(file, filename):
    if file and allowed_file(file.filename):
        file.save(os.path.join(config.UPLOAD_FOLDER, filename))
        return True
    return False


def delete_file(file):
    try:
        os.remove(file)
    except OSError:
        pass
    return True