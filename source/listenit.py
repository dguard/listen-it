from flask import Flask, redirect, url_for, session, request, render_template
from flask_oauth import OAuth
from vk_client import *


app = Flask(__name__, static_folder='', static_url_path='')
app.config.from_envvar('SETTINGS')

oauth = OAuth()
vk_client = VKClient(api_url=app.config['VK_API_URL'])


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



@app.route('/')
def index():	
	return app.send_static_file('index.html')

@app.route('/authorization/vk')
def vk_signin():		
	return vk_oauth.authorize(callback=url_for('authorized', _external=True))	

@app.route('/authorized')
@vk_oauth.authorized_handler
def authorized(resp):	
	next_url = request.args.get('next') or url_for('index', _external=True)

	if resp is None:
		return redirect(url_for('authorization_error', _external=True))
	
	try:
		session['oauth_token'] = resp['access_token']
		session['user_id'] = resp['user_id']
		session['email'] = resp['email']

		vk_response = vk_client.getUserInfo(user_id=session['user_id'], token=session['oauth_token'], fields='first_name,last_name')

		session['name'] = vk_response['first_name'] + ' ' + vk_response['last_name']		
	
	except Exception as e:
		return redirect(url_for('internal_service_error', _external=True))			
	
	return redirect(next_url)


@app.route('/authorization_error')
def authorization_error():
	return 'authorization error page (not implemented yet)'

@app.route('/internal_service_error')
def internal_service_error():
	return 'internal service error page (not implemented yet)'


if __name__ == '__main__':
	app.run()