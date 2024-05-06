from django.contrib import admin
from django.urls import path, include
from transcendence import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
	# Admin part
    path('admin/', admin.site.urls),

	# Run the SPA
	path('', views.index),

	# API VIEWS (SHOW PAGES)
	path('pages/<str:page>/', views.page),

	# METHODS POST ET GET (API)
	path('api/', include("transcendence.api")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
