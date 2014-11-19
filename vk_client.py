import json
from urllib2 import urlopen


API_URL 		= 'https://api.vk.com/method/'
FORMAT 			= 'json'
API_VERSION 	= '4.0'
DEFAULT_TIMEOUT	= 1



class VKClient():

	def __init__(self, api_url=API_URL, format=FORMAT, api_version=API_VERSION, timeout=DEFAULT_TIMEOUT):
		self.api_url = api_url			
		self.format = format		
		self.api_version = api_version
		self.timeout = timeout

	def request(self, method, **params):
		params['v'] = self.api_version		

		url = self.api_url + method + '.' + self.format + '?' + '&'.join([str(key) + '=' + str(value) for key, value in params.items()])
		data = json.loads(urlopen(url, timeout=self.timeout).read().decode('utf8'))
		if 'error' in data:
			raise VKResponseError(data['error'])

		return data['response'][0]

	def getUserInfo(self, user_id, token=None, fields=''):
		params = {'user_ids': user_id,
				  'fields': fields,
				  'access_token': token}
		method = 'users.get'
		return self.request(method, **params)
		


class VKError(Exception):
	pass



class VKResponseError(VKError):

	def __init__(self, error_data):
		self.error = error_data

	@property
	def code(self):
		return self.error['error_code']

	@property
	def description(self):
		return self.error['error_msg']

	@property
	def params(self):
		return self.error['request_params']

	def __str__(self):
		return "Error(code = %s, description = %s)" % (self.code, self.description)
