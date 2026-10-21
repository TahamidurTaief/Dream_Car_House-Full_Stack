# Module matrix

Generated from actual Django model metadata and admin registrations with a dummy database and blocked connections. No customer rows are read. See `audit_modules.py` to regenerate. Baseline: fd8d42d; foundation adds dashboard_api with no models.

## Installed applications

- `jazzmin`
- `django.contrib.admin`
- `django.contrib.auth`
- `django.contrib.contenttypes`
- `django.contrib.sessions`
- `django.contrib.messages`
- `django.contrib.staticfiles`
- `apps.home`
- `apps.inventory`
- `apps.seo_config`
- `apps.dashboard_api`
- `corsheaders`
- `rest_framework`
- `rest_framework_simplejwt`
- `django_filters`
- `fontawesomefree`
- `django_countries`
- `tinymce`
- `csp`

Development additionally installs `django_extensions` and `drf_yasg`; neither adds business models. Production adds no apps. `base.BaseModel` is abstract and `base` is not installed. SimpleJWT is installed, but authtoken and token_blacklist are not. Packages in requirements are not automatically installed Django apps.

## Coverage and endpoint plan

All listed business management endpoints are **planned, not implemented**. Every business row is source/schema verified, but CRUD, authorization, database and browser verification remain pending. GET collection/detail requires active staff plus `view_<model>`; POST requires `add_<model>`; PATCH requires `change_<model>`; DELETE requires `delete_<model>`, each under the listed app label. These are proposed per-model checks, not existing dashboard authorization. No bulk actions planned. Enquiry creation remains public through existing contracts; dashboard creation is not planned. Nested image operations additionally require parent access/change permission. User/group administration remains Django-admin-only for this phase.

| Model | Public endpoint | Required management endpoints / operations | Planned dashboard route | Permissions | Implementation / verification |
|---|---|---|---|---|---|
| `admin.LogEntry` | None | None planned; retain Django internal/admin ownership () | `None` | Existing Django permissions; no dashboard access | Excluded / schema verified |
| `auth.Group` | None | groups/; groups/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/groups` | active staff + auth.{view,add,change,delete}_group by operation | Completed / verified end-to-end; SSR list, permission assignments, member counts, duplicate group name protection |
| `auth.Permission` | None | permissions/ (GET) | Direct catalog API | active staff with auth.view_permission, superuser, or auth.view_{user,group} | Completed / verified end-to-end; Django permissions catalog listing |
| `auth.User` | None | users/; users/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/users` | active staff + auth.{view,add,change,delete}_user by operation | Completed / verified end-to-end; SSR list, password APIs (never leaks hashes/secrets), self-deletion protection, last active admin protection, privilege escalation guards |
| `contenttypes.ContentType` | None | None planned; retain Django internal/admin ownership () | `None` | Existing Django permissions; no dashboard access | Excluded / schema verified |
| `home.ContactMessage` | POST home/contact/ | contact-messages/; contact-messages/<id>/ (GET/PATCH/DELETE; no create) | `/workspace/inbox/contact` | active staff + home.{view,add,change,delete}_contactmessage by operation | Completed / verified end-to-end; SSR list, detail drawer, safe customer content preservation, permission enforcement |
| `home.PeopleTalkAboutUs` | GET home/people-talk/ | social-features/; social-features/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/content/social-features` | active staff + home.{view,add,change,delete}_peopletalkaboutus by operation | Completed / verified end-to-end; SSR list, media upload validation (.jpg/.png/.webp), title/url search, status & featured filters, publication visibility preservation |
| `home.SalesRepresentative` | GET home/sales-representative/ | sales-representatives/; sales-representatives/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/content/sales-representatives` | active staff + home.{view,add,change,delete}_salesrepresentative by operation | Completed / verified end-to-end; SSR list, create/edit drawers, publication controls (PUBLISHED/UNPUBLISHED), public API publication filtering preserved |
| `home.SellCar` | POST home/sell-car/ | sell-cars/; sell-cars/<id>/ (GET/PATCH/DELETE; no create) | `/workspace/sell-cars` | active staff + home.{view,add,change,delete}_sellcar by operation | Completed / verified end-to-end; SSR list, details drawer, customer content preservation, ownership boundary enforcement |
| `home.SellYourCarImages` | Upload through POST home/sell-car/ images field; no standalone route | sell-cars/<id>/images/<image_id>/ (DELETE) | `/workspace/sell-cars` | active staff + home.{view,add,change,delete}_sellyourcarimages by operation; parent access/change | Completed / nested in SellCar list & detail; preview modal dialog, missing image fallback, scoped deletion |
| `home.Slider` | GET home/slider/ (last record) | sliders/; sliders/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/content/sliders` | active staff + home.{view,add,change,delete}_slider by operation | Completed / verified end-to-end; SSR list, media upload validation (.mp4/.webm/.png/.jpg), live public selection indicator (Slider.objects.last()), non-singleton historical preservation |
| `home.SocialMedia` | GET home/sm/ (last record) | social-media/; social-media/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/content/social-media` | active staff + home.{view,add,change,delete}_socialmedia by operation | Completed / verified end-to-end; SSR list, protocol validation (http/https), live public selection indicator (SocialMedia.objects.last()), non-singleton historical preservation |
| `home.Subscriber` | POST home/subscribers/ | subscribers/; subscribers/<id>/ (GET/PATCH/DELETE; no create) | `/workspace/inbox/subscribers` | active staff + home.{view,add,change,delete}_subscriber by operation | Completed / verified end-to-end; SSR list, edit & detail drawers, permission enforcement |
| `inventory.BodyStyle` | GET inventory/body-style/; inventory/filters/ | body-styles/; body-styles/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/body-styles` | active staff + inventory.{view,add,change,delete}_bodystyle by operation | Completed / verified end-to-end; SSR list, create/edit/delete dialogs, permission gating, and test coverage |
| `inventory.Brand` | GET inventory/brands/; inventory/brands/<id>/seo/; inventory/filters/ | brands/; brands/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/brands` | active staff + inventory.{view,add,change,delete}_brand by operation | Completed / verified end-to-end; permission-checked, schema & cascade verified |
| `inventory.Inventory` | GET inventory/, featured/, detail/<slug>/, detail/<slug>/related/, filters/ (all under inventory/); legacy detail/<id>/ paths declared | inventory/; inventory/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/inventory` | active staff + inventory.{view,add,change,delete}_inventory by operation | Implemented / verified endpoints, serializers & SSR workspace; vehicle create/edit/gallery forms preserved |
| `inventory.InventoryImage` | Nested in inventory/detail/<slug>/ | inventory/<id>/images/; inventory/<id>/images/<image_id>/ (GET/POST/PATCH/DELETE) | `/workspace/inventory/[id]/images` | active staff + inventory.{view,add,change,delete}_inventoryimage by operation; parent access/change | Implemented / endpoints and gallery uploader handlers defined |
| `inventory.InventoryQuote` | POST inventory/quote/ | quotes/; quotes/<id>/ (GET/PATCH/DELETE; no create) | `/workspace/quotes` | active staff + inventory.{view,add,change,delete}_inventoryquote by operation | Completed / verified end-to-end; permission-checked, customer contact edit & safe foreign key display |
| `inventory.ModelGeneration` | GET inventory/generations/; inventory/filters/ | model-generations/; model-generations/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/model-generations` | active staff + inventory.{view,add,change,delete}_modelgeneration by operation | Completed / verified end-to-end; permission-checked, relationship & duplicate validation verified |
| `inventory.Stock` | GET inventory/stocks/ | stocks/; stocks/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/stocks` | active staff + inventory.{view,add,change,delete}_stock by operation | Completed / verified end-to-end; SSR list, create/edit/detail drawers, server pagination & ordering, permission-aware navigation |
| `seo_config.CategoryPageSEO` | GET site-config/category-seo/<page>/ | category-seo/; category-seo/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/seo/categories` | active staff + seo_config.{view,add,change,delete}_categorypageseo by operation | Completed / verified end-to-end; SSR list, editorial copy fields (H1, short, long), JSON-LD validation, robots policy control, duplicate page rejection |
| `seo_config.SEOConfig` | GET site-config/seo/<page>/ | page-seo/; page-seo/<id>/ (GET/POST/PATCH/DELETE) | `/workspace/seo/pages` | active staff + seo_config.{view,add,change,delete}_seoconfig by operation | Completed / verified end-to-end; SSR list, Open Graph/Twitter overrides, JSON-LD schema validation, image validation, duplicate page rejection |
| `sessions.Session` | None | None planned; retain Django internal/admin ownership () | `None` | Existing Django permissions; no dashboard access | Excluded / schema verified |

## Complete field, relation and admin inventory

Fields below include implicit IDs and inherited timestamps. Reverse relations are listed separately. Django's inherited `delete_selected` is available to eligible admin users unless overridden; there are no project-defined custom actions. Field choices/defaults are schema metadata, not customer values.

### admin.LogEntry

Table: `django_admin_log`. Source: `backend/.venv/lib/python3.13/site-packages/django/contrib/admin/models.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | AutoField | primary_key; unique; blank |
| `action_time` | DateTimeField | read-only; default=now |
| `user` | ForeignKey | db_index; → auth.User; on_delete=CASCADE |
| `content_type` | ForeignKey | null; blank; db_index; → contenttypes.ContentType; on_delete=SET_NULL |
| `object_id` | TextField | null; blank |
| `object_repr` | CharField | max_length=200 |
| `action_flag` | PositiveSmallIntegerField | choices=1, 2, 3 |
| `change_message` | TextField | blank |

Reverse relations: none.

Not registered independently in admin.

Model methods defined here: `is_addition`, `is_change`, `is_deletion`, `get_change_message`, `get_edited_object`, `get_admin_url`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### auth.Group

Table: `auth_group`. Source: `backend/.venv/lib/python3.13/site-packages/django/contrib/auth/models.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | AutoField | primary_key; unique; blank |
| `name` | CharField | unique; max_length=150 |
| `permissions` | ManyToManyField | blank; → auth.Permission |

Reverse relations: `user_set` ← `auth.User.groups`.

Registered admin: `GroupAdmin`.
- `list_display`: `('__str__',)`
- `search_fields`: `('name',)`
- `ordering`: `('name',)`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `natural_key`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### auth.Permission

Table: `auth_permission`. Source: `backend/.venv/lib/python3.13/site-packages/django/contrib/auth/models.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | AutoField | primary_key; unique; blank |
| `name` | CharField | max_length=255 |
| `content_type` | ForeignKey | db_index; → contenttypes.ContentType; on_delete=CASCADE |
| `codename` | CharField | max_length=100 |

Reverse relations: `group_set` ← `auth.Group.permissions`; `user_set` ← `auth.User.user_permissions`.

Not registered independently in admin.

Model methods defined here: `natural_key`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### auth.User

Table: `auth_user`. Source: `backend/.venv/lib/python3.13/site-packages/django/contrib/auth/models.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | AutoField | primary_key; unique; blank |
| `password` | CharField | max_length=128 |
| `last_login` | DateTimeField | null; blank |
| `is_superuser` | BooleanField | default=False |
| `username` | CharField | unique; max_length=150 |
| `first_name` | CharField | blank; max_length=150 |
| `last_name` | CharField | blank; max_length=150 |
| `email` | CharField | blank; max_length=254 |
| `is_staff` | BooleanField | default=False |
| `is_active` | BooleanField | default=True |
| `date_joined` | DateTimeField | default=now |
| `groups` | ManyToManyField | blank; → auth.Group; related_name=user_set |
| `user_permissions` | ManyToManyField | blank; → auth.Permission; related_name=user_set |

Reverse relations: `logentry_set` ← `admin.LogEntry.user`.

Registered admin: `UserAdmin`.
- `list_display`: `('username', 'email', 'first_name', 'last_name', 'is_staff')`
- `list_filter`: `('is_staff', 'is_superuser', 'is_active', 'groups')`
- `search_fields`: `('username', 'first_name', 'last_name', 'email')`
- `ordering`: `('username',)`
- `fieldsets`: `((None, {'fields': ('username', 'password')}), ('Personal info', {'fields': ('first_name', 'last_name', 'email')}), ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}), ('Important dates', {'fields': ('last_login', 'date_joined')}))`
- Form: `django.contrib.auth.forms.UserChangeForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### contenttypes.ContentType

Table: `django_content_type`. Source: `backend/.venv/lib/python3.13/site-packages/django/contrib/contenttypes/models.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | AutoField | primary_key; unique; blank |
| `app_label` | CharField | max_length=100 |
| `model` | CharField | max_length=100 |

Reverse relations: `logentry_set` ← `admin.LogEntry.content_type`; `permission_set` ← `auth.Permission.content_type`.

Not registered independently in admin.

Model methods defined here: `model_class`, `get_object_for_this_type`, `get_all_objects_for_this_type`, `natural_key`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### home.ContactMessage

Table: `tbl_contact_messages`. Source: `backend/apps/home/models/contact_message_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `created_at` | DateTimeField | blank; read-only |
| `updated_at` | DateTimeField | blank; read-only |
| `topic` | CharField | max_length=20; default=ContactMessage.TopicChoices.BUYING; choices=BUYING, SELLING, AFTER_SALES, OTHER |
| `name` | CharField | max_length=100 |
| `phone` | CharField | max_length=20 |
| `email` | CharField | blank; max_length=254; default='' |
| `vehicle` | CharField | blank; max_length=150; default='' |
| `message` | TextField | max_length=3000 |
| `preferred_contact` | CharField | max_length=10; default=ContactMessage.PreferredContactChoices.WHATSAPP; choices=WHATSAPP, PHONE, EMAIL |

Reverse relations: none.

Registered admin: `ContactMessageAdmin`.
- `list_display`: `['name', 'phone', 'topic', 'preferred_contact', 'vehicle', 'created_at']`
- `list_filter`: `['topic', 'preferred_contact']`
- `search_fields`: `['name', 'phone', 'email', 'vehicle', 'message']`
- `readonly_fields`: `['created_at', 'updated_at']`
- `date_hierarchy`: `'created_at'`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `TopicChoices`, `PreferredContactChoices`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### home.PeopleTalkAboutUs

Table: `tbl_people_talk`. Source: `backend/apps/home/models/people_talk_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `created_at` | DateTimeField | blank; read-only |
| `updated_at` | DateTimeField | blank; read-only |
| `title` | CharField | max_length=300 |
| `image` | FileField | max_length=500 |
| `url` | CharField | null; blank; max_length=300 |
| `is_featured` | BooleanField | default=False |
| `status` | CharField | max_length=12; default=BaseModel.StatusChoices.PUBLISHED; choices=PUBLISHED, UNPUBLISHED, ARCHIVED, UNLISTED |

Reverse relations: none.

Registered admin: `PeopleTalkAboutUsAdmin`.
- `list_display`: `['title', 'url', 'is_featured', 'status']`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### home.SalesRepresentative

Table: `tbl_sales_representative`. Source: `backend/apps/home/models/sales_representative.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `created_at` | DateTimeField | blank; read-only |
| `updated_at` | DateTimeField | blank; read-only |
| `name` | CharField | max_length=100 |
| `phone_number` | CharField | max_length=15 |
| `status` | CharField | max_length=12; default=BaseModel.StatusChoices.PUBLISHED; choices=PUBLISHED, UNPUBLISHED, ARCHIVED, UNLISTED |

Reverse relations: none.

Registered admin: `SalesRepresentativeAdmin`.
- `list_display`: `['name', 'phone_number', 'status']`
- `list_filter`: `['status']`
- `search_fields`: `['name', 'phone_number']`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### home.SellCar

Table: `tbl_sellcar`. Source: `backend/apps/home/models/sell_car_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `name` | CharField | max_length=100 |
| `phone` | CharField | max_length=18 |
| `car_name` | CharField | max_length=100 |
| `car_model` | CharField | max_length=100 |
| `car_year` | CharField | max_length=100 |
| `offered_price` | PositiveBigIntegerField | null; blank |
| `mileage` | PositiveIntegerField |  |

Reverse relations: `inventory_images` ← `home.SellYourCarImages.sellcar`.

Registered admin: `SellCarAdmin`.
- `list_display`: `['name', 'phone', 'car_name', 'car_model', 'car_year', 'mileage', 'offered_price']`
- `search_fields`: `['name', 'phone', 'car_name', 'car_model']`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.
- Inline `SellYourCarImagesAdminInline` → `home.SellYourCarImages`; type `StackedInline`; extra=0; fields=None; readonly=(); ordering=None.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### home.SellYourCarImages

Table: `tbl_sell_your_cars_images`. Source: `backend/apps/home/models/sell_your_cars_image_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `sellcar` | ForeignKey | db_index; → home.SellCar; on_delete=CASCADE; related_name=inventory_images |
| `image` | FileField | max_length=500 |

Reverse relations: none.

Not registered independently in admin.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### home.Slider

Table: `tbl_video`. Source: `backend/apps/home/models/slider_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `heading` | CharField | max_length=100 |
| `image` | FileField | max_length=500 |

Reverse relations: none.

Registered admin: `SliderAdmin`.
- `list_display`: `['heading', 'image']`
- `search_fields`: `['heading']`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### home.SocialMedia

Table: `tbl_socialmedia`. Source: `backend/apps/home/models/socialmedia_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `facebook` | CharField | max_length=300 |
| `instagram` | CharField | null; blank; max_length=300 |
| `twitter` | CharField | null; blank; max_length=300 |
| `youtube` | CharField | null; blank; max_length=300 |

Reverse relations: none.

Registered admin: `SocialMediaAdmin`.
- `list_display`: `['facebook', 'instagram', 'twitter', 'youtube']`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### home.Subscriber

Table: `tbl_subscribers`. Source: `backend/apps/home/models/subscribers_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `email` | CharField | unique; max_length=32 |

Reverse relations: none.

Registered admin: `SubscriberAdmin`.
- `list_display`: `['email']`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### inventory.BodyStyle

Table: `tbl_body_style`. Source: `backend/apps/inventory/models/body_style_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `body` | CharField | max_length=100 |
| `status` | CharField | max_length=12; default=BaseModel.StatusChoices.PUBLISHED; choices=PUBLISHED, UNPUBLISHED, ARCHIVED, UNLISTED |

Reverse relations: `inventories_body_style` ← `inventory.Inventory.body_style`.

Registered admin: `BodyStyleAdmin`.
- `list_display`: `['body', 'status']`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### inventory.Brand

Table: `tbl_brand`. Source: `backend/apps/inventory/models/brand_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `name` | CharField | max_length=100 |
| `segment` | CharField | max_length=20; default=Brand.SegmentChoices.REFINED_VERSATILE; choices=LUXURY_PERFORMANCE, REFINED_VERSATILE, ELECTRIC |
| `image` | FileField | max_length=500 |
| `listing_footer_text` | TextField | blank; default='' |
| `status` | CharField | max_length=12; default=BaseModel.StatusChoices.PUBLISHED; choices=PUBLISHED, UNPUBLISHED, ARCHIVED, UNLISTED |
| `target_keyword` | CharField | null; blank; max_length=120; default=None |
| `meta_title` | CharField | null; blank; max_length=70; default=None |
| `meta_description` | TextField | null; blank; max_length=500; default=None |
| `canonical_url` | CharField | null; blank; max_length=500; default=None |
| `robots` | CharField | max_length=50; default=Brand.RobotsChoices.INDEX_FOLLOW; choices=index, follow, index, nofollow, noindex, nofollow |
| `schema_json` | JSONField | null; blank |
| `h1_title` | CharField | null; blank; max_length=200; default=None |
| `short_description` | TextField | null; blank |
| `long_description` | TextField | null; blank |
| `feature_image` | FileField | null; blank; max_length=100 |
| `feature_image_alt` | CharField | null; blank; max_length=200; default=None |
| `seo_updated_at` | DateTimeField | blank; read-only |

Reverse relations: `model_generations_brand` ← `inventory.ModelGeneration.brand`; `inventories_brand` ← `inventory.Inventory.brand`.

Registered admin: `BrandAdmin`.
- `list_display`: `['name', 'segment', 'image', 'status']`
- `list_filter`: `['segment', 'status']`
- `search_fields`: `['name']`
- `readonly_fields`: `['seo_updated_at']`
- `fieldsets`: `(('General', {'fields': ('name', 'segment', 'image', 'listing_footer_text', 'status')}), ('On-Page Content', {'fields': ('h1_title', 'short_description', 'long_description'), 'description': "H1 heading, the intro shown above the car grid, and the detailed text shown below pagination on this brand's listing page (/cars/brand/&lt;slug&gt;)."}), ('Search Meta', {'fields': ('target_keyword', 'meta_title', 'meta_description', 'canonical_url', 'robots')}), ('Feature Image (social sharing)', {'fields': ('feature_image', 'feature_image_alt'), 'description': "Shown when this brand's listing page is shared on social media."}), ('Structured Data (JSON-LD)', {'classes': ('collapse',), 'fields': ('schema_json',)}), ('Timestamps', {'fields': ('seo_updated_at',)}))`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `SegmentChoices`, `RobotsChoices`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### inventory.Inventory

Table: `tbl_inventories`. Source: `backend/apps/inventory/models/inventory_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `created_at` | DateTimeField | blank; read-only |
| `updated_at` | DateTimeField | blank; read-only |
| `name` | CharField | max_length=100 |
| `car_type` | CharField | null; blank; max_length=25; choices=RECONDITIONED, BRAND_NEW, PRE_OWNED |
| `brand` | ForeignKey | db_index; → inventory.Brand; on_delete=CASCADE; related_name=inventories_brand |
| `model` | ForeignKey | null; blank; db_index; → inventory.ModelGeneration; on_delete=SET_NULL; related_name=inventories_model |
| `model_name` | CharField | blank; max_length=255; default='' |
| `year` | PositiveIntegerField | null; blank |
| `engine_capacity` | CharField | null; blank; max_length=20 |
| `fuel_type` | CharField | max_length=30; choices=PETROL, DIESEL, OCTANE, ELECTRIC, HYBRID, PETROL+HYBRID, DIESEL+HYBRID, OCTANE+HYBRID, CNG+HYBRID, LPG+HYBRID, PETROL+PLUG-IN HYBRID, DIESEL+PLUG-IN HYBRID, OCTANE+PLUG-IN HYBRID, CNG+PLUG-IN HYBRID, LPG+PLUG-IN HYBRID, CNG, LPG, ETHANOL, HYDROGEN, BIO-DIESEL, FLEX-FUEL, OTHERS |
| `mileage` | CharField | null; blank; max_length=20 |
| `price` | DecimalField | null; blank; max_digits=12; decimal_places=2 |
| `transmission` | CharField | max_length=20; choices=MANUAL, AUTOMATIC |
| `drive_type` | CharField | null; blank; max_length=50 |
| `wheel_base` | CharField | null; blank; max_length=20 |
| `color` | CharField | null; blank; max_length=30 |
| `condition` | CharField | max_length=10; choices=NEW, USED |
| `registered` | CharField | max_length=12; default=Inventory.AvailabilityChoices.AVAILABLE; choices=Available, Sold, Booked, Pre-Order |
| `body_style` | ForeignKey | null; blank; db_index; → inventory.BodyStyle; on_delete=SET_NULL; related_name=inventories_body_style |
| `feature_image` | FileField | null; blank; max_length=500 |
| `description` | TextField | null; blank |
| `youtube` | CharField | null; blank; max_length=500 |
| `is_featured` | BooleanField | default=False |
| `inventory_type` | CharField | max_length=20; default=Inventory.InventoryTypeChoices.BUDGET_FRIENDLY; choices=LUXURY, BUDGET FRIENDLY |
| `slightly_negotiable` | CharField | max_length=5; default=Inventory.SlightlyNegotiable.YES; choices=YES, NO |
| `status` | CharField | max_length=12; default=BaseModel.StatusChoices.PUBLISHED; choices=PUBLISHED, UNPUBLISHED, ARCHIVED, UNLISTED |
| `h1_title` | CharField | blank; max_length=200 |
| `target_keyword` | CharField | blank; max_length=120 |
| `meta_title` | CharField | blank; max_length=70 |
| `meta_description` | TextField | blank; max_length=500 |
| `slug` | SlugField | unique; db_index; max_length=255 |
| `redirect_url` | CharField | null; blank; max_length=500 |
| `canonical_url` | CharField | blank; max_length=500 |
| `schema_override` | JSONField | null; blank |
| `featured_image_alt` | CharField | blank; max_length=200 |
| `indexing` | CharField | max_length=20; default=Inventory.IndexingChoices.INDEX_FOLLOW; choices=index, follow, index, nofollow, noindex, nofollow |
| `previous_slug` | CharField | blank; max_length=255; default='' |

Reverse relations: `inventory_images` ← `inventory.InventoryImage.inventory`; `quotes` ← `inventory.InventoryQuote.car`.

Registered admin: `InventoryAdmin`.
- `list_display`: `['name', 'car_type', 'brand', 'model', 'fuel_type', 'transmission', 'year', 'condition', 'registered', 'slightly_negotiable', 'status', 'slug', 'indexing', 'meta_title']`
- `list_filter`: `['car_type', 'brand', 'model', 'fuel_type', 'transmission', 'year', 'condition', 'registered', 'status', 'indexing']`
- `search_fields`: `['name', 'description', 'slug', 'meta_title']`
- `readonly_fields`: `['feature_image_preview']`
- `fieldsets`: `(('General', {'fields': ('name', 'car_type', 'brand', 'model', 'year', 'engine_capacity', 'fuel_type', 'mileage', 'price', 'transmission', 'drive_type', 'wheel_base', 'color', 'condition', 'registered', 'body_style', 'feature_image', 'feature_image_preview', 'description', 'youtube', 'is_featured', 'inventory_type', 'slightly_negotiable', 'status')}), ('SEO Settings', {'fields': ('h1_title', 'target_keyword', 'meta_title', 'meta_description', 'slug', 'canonical_url', 'featured_image_alt', 'indexing', 'redirect_url', 'previous_slug', 'schema_override')}))`
- Form: `apps.inventory.admin.InventoryAdminForm`; inherited bulk action: `delete_selected`.
- Inline `InventoryImageInline` → `inventory.InventoryImage`; type `TabularInline`; extra=1; fields=['image', 'image_preview', 'caption', 'alt_text', 'order']; readonly=['image_preview']; ordering=['order'].

Model methods defined here: `AvailabilityChoices`, `CarTypeChooser`, `ConditionChoices`, `TransmissionChoices`, `FuelTypeChoices`, `InventoryTypeChoices`, `SlightlyNegotiable`, `IndexingChoices`, `_get_brand_name`, `_get_model_name`, `_get_body_style_name`, `_generate_unique_slug`, `_build_canonical_url`, `save`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### inventory.InventoryImage

Table: `tbl_inventory_images`. Source: `backend/apps/inventory/models/innventory_image_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `inventory` | ForeignKey | db_index; → inventory.Inventory; on_delete=CASCADE; related_name=inventory_images |
| `caption` | CharField | null; blank; max_length=100 |
| `image` | FileField | max_length=500 |
| `alt_text` | CharField | blank; max_length=200 |
| `order` | PositiveIntegerField | default=0 |

Reverse relations: none.

Not registered independently in admin.

Model methods defined here: `save`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### inventory.InventoryQuote

Table: `tbl_inventory_quote`. Source: `backend/apps/inventory/models/inventory_quote_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `created_at` | DateTimeField | blank; read-only |
| `updated_at` | DateTimeField | blank; read-only |
| `car` | ForeignKey | null; blank; db_index; → inventory.Inventory; on_delete=SET_NULL; related_name=quotes |
| `name` | CharField | max_length=100 |
| `email` | CharField | max_length=32 |
| `phone` | CharField | max_length=18 |

Reverse relations: none.

Registered admin: `InventoryQuoteAdmin`.
- `list_display`: `['name', 'email', 'phone', 'car', 'created_at']`
- `ordering`: `('-created_at',)`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### inventory.ModelGeneration

Table: `tbl_model_generations`. Source: `backend/apps/inventory/models/model_generation.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `brand` | ForeignKey | db_index; → inventory.Brand; on_delete=CASCADE; related_name=model_generations_brand |
| `model` | CharField | max_length=100 |
| `status` | CharField | max_length=12; default=BaseModel.StatusChoices.PUBLISHED; choices=PUBLISHED, UNPUBLISHED, ARCHIVED, UNLISTED |

Reverse relations: `inventories_model` ← `inventory.Inventory.model`.

Registered admin: `ModelGenerationAdmin`.
- `list_display`: `['brand', 'model', 'status']`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### inventory.Stock

Table: `tbl_stocks`. Source: `backend/apps/inventory/models/stock_model.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `created_at` | DateTimeField | blank; read-only |
| `updated_at` | DateTimeField | blank; read-only |
| `title` | CharField | null; blank; max_length=100 |
| `image` | FileField | max_length=500 |
| `status` | CharField | max_length=12; default=BaseModel.StatusChoices.PUBLISHED; choices=PUBLISHED, UNPUBLISHED, ARCHIVED, UNLISTED |

Reverse relations: none.

Registered admin: `StockAdmin`.
- `list_display`: `['title', 'status', 'created_at']`
- `ordering`: `('-created_at',)`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### seo_config.CategoryPageSEO

Table: `tbl_category_page_seo`. Source: `backend/apps/seo_config/models.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `page` | CharField | unique; max_length=50; choices=cars, brand-new, pre-owned, brand |
| `category_name` | CharField | null; blank; max_length=120; default=None |
| `visibility` | CharField | max_length=10; default=CategoryPageSEO.VisibilityChoices.PUBLISHED; choices=PUBLISHED, HIDDEN |
| `feature_image` | FileField | null; blank; max_length=100 |
| `feature_image_alt` | CharField | null; blank; max_length=200; default=None |
| `target_keyword` | CharField | null; blank; max_length=120; default=None |
| `meta_title` | CharField | null; blank; max_length=70; default=None |
| `meta_description` | TextField | null; blank; max_length=500; default=None |
| `canonical_url` | CharField | null; blank; max_length=500; default=None |
| `robots` | CharField | max_length=50; default=CategoryPageSEO.RobotsChoices.INDEX_FOLLOW; choices=index, follow, index, nofollow, noindex, nofollow |
| `schema_json` | JSONField | null; blank |
| `h1_title` | CharField | null; blank; max_length=200; default=None |
| `short_description` | TextField | null; blank |
| `long_description` | TextField | null; blank |
| `updated_at` | DateTimeField | blank; read-only |

Reverse relations: none.

Registered admin: `CategoryPageSEOAdmin`.
- `list_display`: `['get_page_display', 'category_name', 'h1_title', 'robots', 'visibility', 'updated_at']`
- `list_display_links`: `['get_page_display', 'category_name']`
- `list_filter`: `['visibility', 'robots']`
- `readonly_fields`: `['updated_at']`
- `fieldsets`: `(('Page', {'fields': ('page', 'category_name', 'visibility')}), ('On-Page Content', {'fields': ('h1_title', 'short_description', 'long_description'), 'description': 'H1 heading, the intro shown above the car grid, and the detailed text shown below the pagination.'}), ('Search Meta', {'fields': ('target_keyword', 'meta_title', 'meta_description', 'canonical_url', 'robots')}), ('Feature Image (social sharing)', {'fields': ('feature_image', 'feature_image_alt'), 'description': 'Shown when this page is shared on social media.'}), ('Structured Data (JSON-LD)', {'classes': ('collapse',), 'fields': ('schema_json',)}), ('Timestamps', {'fields': ('updated_at',)}))`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `PageChoices`, `RobotsChoices`, `VisibilityChoices`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### seo_config.SEOConfig

Table: `seo_config_seoconfig`. Source: `backend/apps/seo_config/models.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `id` | BigAutoField | primary_key; unique; blank |
| `page` | CharField | unique; max_length=50; choices=home, gallery, about, sell, byd-cars, contact |
| `visibility` | CharField | max_length=10; default=SEOConfig.VisibilityChoices.PUBLISHED; choices=PUBLISHED, HIDDEN |
| `target_keyword` | CharField | null; blank; max_length=120; default=None |
| `feature_image` | FileField | null; blank; max_length=100 |
| `feature_image_alt` | CharField | null; blank; max_length=200; default=None |
| `meta_title` | CharField | null; blank; max_length=70; default=None |
| `meta_description` | TextField | null; blank; max_length=500; default=None |
| `meta_keywords` | CharField | null; blank; max_length=500; default=None |
| `robots` | CharField | null; blank; max_length=50; default=SEOConfig.RobotsChoices.INDEX_FOLLOW; choices=index, follow, noindex, follow, index, nofollow, noindex, nofollow |
| `canonical_url` | CharField | null; blank; max_length=500; default=None |
| `og_title` | CharField | null; blank; max_length=200; default=None |
| `og_description` | TextField | null; blank; max_length=500; default=None |
| `og_image` | FileField | null; blank; max_length=100 |
| `og_type` | CharField | null; blank; max_length=50; default=SEOConfig.OGTypeChoices.WEBSITE; choices=website, article |
| `og_site_name` | CharField | null; blank; max_length=100; default='Beg Autos' |
| `twitter_card` | CharField | null; blank; max_length=50; default=SEOConfig.TwitterCardChoices.SUMMARY_LARGE; choices=summary_large_image, summary |
| `twitter_title` | CharField | null; blank; max_length=200; default=None |
| `twitter_description` | TextField | null; blank; max_length=500; default=None |
| `twitter_image` | FileField | null; blank; max_length=100 |
| `schema_json` | JSONField | null; blank |
| `updated_at` | DateTimeField | blank; read-only |

Reverse relations: none.

Registered admin: `SEOConfigAdmin`.
- `list_display`: `['get_page_display', 'meta_title', 'robots', 'visibility', 'updated_at']`
- `list_display_links`: `['get_page_display', 'meta_title']`
- `list_filter`: `['visibility', 'robots']`
- `readonly_fields`: `['updated_at']`
- `fieldsets`: `(('Page', {'fields': ('page', 'visibility')}), ('Basic Meta Tags', {'fields': ('target_keyword', 'meta_title', 'meta_description', 'meta_keywords', 'robots', 'canonical_url'), 'description': 'Core HTML meta tags used by all search engines.'}), ('Feature Image (social sharing)', {'fields': ('feature_image', 'feature_image_alt'), 'description': 'Shown when this page is shared on social media. Used for both Open Graph and Twitter unless overridden below.'}), ('Open Graph (Facebook / LinkedIn / WhatsApp)', {'classes': ('collapse',), 'fields': ('og_title', 'og_description', 'og_image', 'og_type', 'og_site_name'), 'description': 'Optional per-platform overrides. Leave the image blank to use the Feature Image.'}), ('Twitter / X Card', {'classes': ('collapse',), 'fields': ('twitter_card', 'twitter_title', 'twitter_description', 'twitter_image'), 'description': 'Optional per-platform overrides. Leave the image blank to use the Feature Image.'}), ('Structured Data (JSON-LD)', {'fields': ('schema_json',), 'description': 'Optional custom schema.org JSON-LD block for rich search results.'}), ('Timestamps', {'fields': ('updated_at',)}))`
- Form: `django.forms.models.ModelForm`; inherited bulk action: `delete_selected`.

Model methods defined here: `PageChoices`, `RobotsChoices`, `OGTypeChoices`, `TwitterCardChoices`, `VisibilityChoices`, `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

### sessions.Session

Table: `django_session`. Source: `backend/.venv/lib/python3.13/site-packages/django/contrib/sessions/models.py`.

| Field | Type | Constraints / relation |
|---|---|---|
| `session_key` | CharField | primary_key; unique; max_length=40 |
| `session_data` | TextField |  |
| `expire_date` | DateTimeField | db_index |

Reverse relations: none.

Not registered independently in admin.

Model methods defined here: `DoesNotExist`, `MultipleObjectsReturned`, `NotUpdated`.

## Admin and serializer behavior requiring preservation

- InventoryAdminForm makes slug optional and checks supplied slug uniqueness excluding the current row. General and SEO fieldsets; image preview is read-only, preview JavaScript enabled. `model_name` exists on the model but is omitted from InventoryAdmin fieldsets. InventoryImage is inline-only, ordered, with editable caption/alt/order and a read-only preview.
- SellCar has a stacked SellYourCarImages inline (extra=0); image model has no standalone admin. Other registered business models use standard ModelAdmin forms. No project custom actions or custom save_model overrides found.
- Built-in UserAdmin includes password hashing/change forms and permission/group handling; GroupAdmin manages permission M2M. Do not replace these with generic serializers. Permission, ContentType, Session and LogEntry are internal models, not new business modules.
- Public inventory serializers flatten brand/model/body style names and replace numeric price with Sold or Pre-Order; these are not suitable management write serializers. Detail schema JSON is generated unless schema_override is set. Images use OptimizedImageSerializerMixin; Stock returns its raw URL.
- ContactMessageSerializer exposes `enquiry` mapped to model `message`, sanitizes text with bleach, checks phone syntax, and requires email for EMAIL contact. Preserve that public alias. SellCarSerializer sanitizes name; image validation/save runs after parent save and is not wrapped in an explicit transaction. Public image mixin accepts JPEG/PNG, while model extension validators also allow WebP. SubscriberSerializer defines validate_name although Subscriber has only email; it is not called for that model. These discrepancies are recorded, not changed.
- Slider.image is labelled Video and has no file-extension validator. Brand has status but no visibility field or stored slug. SEO page keys are unique. Legacy BYD SEO choice remains although public /byd-cars redirects to /cars/brand/byd.

Foundation endpoint: `GET /api/v1/dashboard/access/` is implemented and always denied with 403. No business-model endpoint is enabled. See API_CONTRACT.md and PROGRESS.md for verified boundary tests.
