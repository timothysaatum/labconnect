

def find_ip_address(request):
	
	x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

	if x_forwarded_for:

		ip = x_forwarded_for.split(',')[0]
		

	ip = request.META.get('REMOTE_ADDR')

	device = request.META['HTTP_USER_AGENT']
		
	data = {'ip':ip, 'device':device}

	return data