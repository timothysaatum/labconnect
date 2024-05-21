from django.urls import path
from .views import (

		CreateUserView, 
		VerifyUserEmail, 
		LoginUserView, 
		PasswordResetView, 
		PasswordResetConfirm, 
		LogoutView,
		SetNewPassword, 
		CheckRefreshToken, 
		FetchUserData, 
		InviteBranchManagerView,
		InvitationAcceptView
	)
from rest_framework_simplejwt import views


app_name='user'
urlpatterns = [

	path('create-account/', CreateUserView.as_view(), name='sign-up'),
	path('login/', LoginUserView.as_view(), name='login'),
	path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
	path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='password-reset-confirm'),
	path('set-new-password/', SetNewPassword.as_view(), name='password-reset-complete'),
	path('verify-email/', VerifyUserEmail.as_view(), name='verify'),
	path('logout/', LogoutView.as_view(), name='logout'),
	path('refresh/token/', CheckRefreshToken.as_view(), name='token-refresh'),
	path('fetch-user-data/', FetchUserData.as_view(), name='user-data')	,
	path('invite/branch-manager/', InviteBranchManagerView.as_view(), name='invite-branch-manager'),
	path('invite/branch-manager/accept/<uuid:invitation_code>/', InvitationAcceptView.as_view(), name='invite-accept')
]