from django.urls import path, include
from rest_framework.routers import DefaultRouter
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
		BranchManagerAcceptView,
		UpdateUserAccount,
		DeleteUserAccount,
        FetchLabManagers,
        RequestNewOTP,
        ComplaintViewSet,
        AddWorker,
	)


app_name='user'

router = DefaultRouter()
router.register(r'complaints', ComplaintViewSet, basename='complaint')

urlpatterns = [
	path('create-account/', CreateUserView.as_view(), name='sign-up'),
	path('update-account/<int:pk>/', UpdateUserAccount.as_view(), name='update-account'),
	path('delete-account/<int:pk>/', DeleteUserAccount.as_view(), name='delete-account'),
	path('login/', LoginUserView.as_view(), name='login'),
	path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
	path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='password-reset-confirm'),
	path('set-new-password/', SetNewPassword.as_view(), name='password-reset-complete'),
	path('verify-email/', VerifyUserEmail.as_view(), name='verify'),
	path('logout/', LogoutView.as_view(), name='logout'),
	path('refresh/token/', CheckRefreshToken.as_view(), name='token-refresh'),
	path('fetch-user-data/', FetchUserData.as_view(), name='user-data')	,
	path('invite/branch-manager/', InviteBranchManagerView.as_view(), name='invite-branch-manager'),
	path('branch-manager-accept-invite/<int:pk>/<uuid:invitation_code>/', BranchManagerAcceptView.as_view(), name='invite-accept'),
    path('fetch-lab-managers/<uuid:pk>/', FetchLabManagers.as_view(), name='fetch-managers'),
    path('request-new-otp/', RequestNewOTP.as_view(), name='new-otp'),
    path('', include(router.urls)),
    path('add-worker/', AddWorker.as_view(), name='add-worker')
]
