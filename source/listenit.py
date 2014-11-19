from flask import Flask, redirect, url_for, session, request, render_template
from flask_oauth import OAuth
import functools

from vk_client import *
from listenit_db import *


app = Flask(__name__, static_folder='static', static_url_path='static')
app.config.from_envvar('SETTINGS')

oauth = OAuth()
vk_client = VKClient(api_url=app.config['VK_API_URL'])
db = Database(db_name=app.config['DB_NAME'], db_path=app.config['DB_PATH'])


vk_oauth = oauth.remote_app('vk',
	base_url				= app.config['VK_OAUTH_URL'],	
	consumer_key			= app.config['VK_APP_ID'],
	consumer_secret			= app.config['VK_APP_SECRET'],
	access_token_url		= '/access_token',
	authorize_url			= '/authorize',
	request_token_url		= None,	
	request_token_params	= {'scope': 'email'}
)

@vk_oauth.tokengetter
def get_vk_oauth_token():	
	return session.get('oauth_token')


class AuthorizationError(Exception):
	pass

def redirect_if_error(function):
	@functools.wraps(function)
	def wrapper(*args, **kwargs):
		try:
			return function(*args, **kwargs)
		except AuthorizationError as e:
			return redirect(url_for('authorization_error', _external=True))
		except Exception as e:
			return redirect(url_for('internal_service_error', _external=True))        
	return wrapper




@app.route('/')
@redirect_if_error
def index():	
	return app.send_static_file('index.html')


@app.route('/authorization/vk')
@redirect_if_error
def vk_signin():		
	return vk_oauth.authorize(callback=url_for('authorized', _external=True))	


@app.route('/authorized')
@vk_oauth.authorized_handler
@redirect_if_error
def authorized(resp):	
	if resp is None:
		raise AuthorizationError()

	next_url = request.args.get('next') or url_for('index', _external=True)	

	session['oauth_token'] = resp['access_token']
	session['user_id'] = resp['user_id']
	session['email'] = resp['email']
	vk_response = vk_client.getUserInfo(user_id=session['user_id'], token=session['oauth_token'], fields='first_name,last_name')
	session['name'] = vk_response['first_name'] + ' ' + vk_response['last_name']		
		
	return redirect(next_url)


@app.route('/available_audio')
@redirect_if_error
def available_audio():	
	user_id = session.get('user_id', -1)
	connection = db.connection()
	return connection.get_audio_info(user_id=user_id, fields='title')	


@app.route('/save_result', methods=['POST'])
@redirect_if_error
def save_result():
	next_url = request.args.get('next') or url_for('index', _external=True)	
	audio_id = request.form['audio_id']
	user_id = request.form['vk_uid']
	result = request.form['res']

	connection = db.connection()
	connection.update_achievement(audio_id=audio_id, user_id=user_id, result=result)	

	return redirect(next_url)


@app.route('/authorization_error')
def authorization_error():
	return 'authorization error page (not implemented yet)'


@app.route('/internal_service_error')
def internal_service_error():
	return 'internal service error page (not implemented yet)'




if __name__ == '__main__':
	app.run()