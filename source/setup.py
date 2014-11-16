from flask import Flask, request, redirect, url_for
import os
import config
import midi_parser
import helpers
import uuid

app = Flask(__name__, static_url_path='')


@app.route("/")
def root():
    return app.send_static_file('index.html')


@app.route("/upload.html")
def upload_page():
    return app.send_static_file('upload.html')


@app.route("/upload", methods=['POST'])
def upload():
    file = request.files.get("file")
    if request.method == 'POST' and file:
        new_filename = uuid.uuid4().__str__()
        fullname = os.path.join(config.UPLOAD_FOLDER, new_filename)
        try:
            helpers.save_file(file, new_filename)
            resp = midi_parser.get_json_for_file(fullname)
        finally:
            helpers.delete_file(fullname)
        return resp
    return 'Cannot save file'

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Development Server Help')
    parser.add_argument("-d", "--debug", action="store_true", dest="debug_mode",
                        help="run in debug mode (for use with PyCharm)", default=False)
    parser.add_argument("-p", "--port", dest="port",
                        help="port of server (default:%(default)s)", type=int, default=5000)

    cmd_args = parser.parse_args()
    app_options = {"port": cmd_args.port}

    if cmd_args.debug_mode:
        app_options["debug"] = True
        app_options["use_debugger"] = True
        app_options["use_reloader"] = True

    # logging
    import logging
    from logging.handlers import RotatingFileHandler
    file_handler = RotatingFileHandler('runtime/app.log')
    file_handler.setLevel(logging.WARNING)
    app.logger.addHandler(file_handler)

    app.run()