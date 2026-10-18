from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator

from tinymce.models import HTMLField

from base.models import BaseModel
from core.utils import images_path_dir


class Brand(models.Model):
    class SegmentChoices(models.TextChoices):
        LUXURY_PERFORMANCE = "LUXURY_PERFORMANCE", _("Luxury & Performance")
        REFINED_VERSATILE = "REFINED_VERSATILE", _("Refined & Versatile")
        ELECTRIC = "ELECTRIC", _("Electric")

    class RobotsChoices(models.TextChoices):
        INDEX_FOLLOW = "index, follow", _("Index & follow")
        INDEX_NOFOLLOW = "index, nofollow", _("Index & nofollow")
        NOINDEX_NOFOLLOW = "noindex, nofollow", _("Noindex & nofollow")

    name = models.CharField(
        max_length=100,
        verbose_name=_("Heading")
    )
    segment = models.CharField(
        max_length=20,
        choices=SegmentChoices.choices,
        default=SegmentChoices.REFINED_VERSATILE,
        verbose_name=_("Segment"),
        help_text=_("Used to group this brand on the /cars/brand listing page."),
    )
    image = models.FileField(
        upload_to=images_path_dir,
        max_length=500,
        validators=[FileExtensionValidator(
            ['jpg', 'jpeg', 'png', 'webp']
        )],
        help_text=_("jpg, jpeg, png, webp"),
        verbose_name=_("Image")
    )
    listing_footer_text = models.TextField(
        blank=True,
        default="",
        verbose_name=_("Listing Footer Text"),
        help_text=_(
            "Optional. Shown at the bottom of this brand's own car listing "
            "page (/cars/brand/<slug>), below pagination. Leave blank to show nothing."
        ),
    )
    status = models.CharField(
        max_length=12,
        choices=BaseModel.StatusChoices.choices,
        default=BaseModel.StatusChoices.PUBLISHED,
        verbose_name=_("Status")
    )

    # ── SEO Fields — mirrors seo_config.CategoryPageSEO's field set exactly,
    # so a brand's own listing page (/cars/brand/<slug>) gets the same SEO
    # capability as the fixed category pages. No separate `page`/`visibility`
    # here: `status` above already gates whether the brand (and its page)
    # appears anywhere. ──────────────────────────────────────────────
    target_keyword = models.CharField(
        max_length=120,
        blank=True,
        null=True,
        default=None,
        verbose_name=_("Target / Primary Keyword"),
        help_text=_("The single primary keyword this brand's listing page is optimised for."),
    )
    meta_title = models.CharField(
        max_length=70,
        blank=True,
        null=True,
        default=None,
        verbose_name=_("Meta Title"),
        help_text=_("Shown in the browser tab and search results (max 70 chars)."),
    )
    meta_description = models.TextField(
        max_length=500,
        blank=True,
        null=True,
        default=None,
        verbose_name=_("Meta Description"),
        help_text=_("Brief description for search engines (max 500 chars)."),
    )
    canonical_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        default=None,
        verbose_name=_("Canonical URL"),
        help_text=_("Preferred URL for this page, e.g. https://www.begautos.com/cars/brand/toyota/."),
    )
    robots = models.CharField(
        max_length=50,
        choices=RobotsChoices.choices,
        default=RobotsChoices.INDEX_FOLLOW,
        verbose_name=_("Indexing Status"),
        help_text=_("Controls search engine indexing and link following."),
    )
    schema_json = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_("JSON-LD Schema"),
        help_text=_("Optional custom schema.org structured data."),
    )
    h1_title = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        default=None,
        verbose_name=_("H1 Title"),
        help_text=_("Main heading shown on the page. Separate from the Meta Title."),
    )
    short_description = HTMLField(
        blank=True,
        null=True,
        verbose_name=_("Short Description"),
        help_text=_("Shown near the top of the page, above the car grid."),
    )
    long_description = HTMLField(
        blank=True,
        null=True,
        verbose_name=_("Long / Detailed Description"),
        help_text=_('Shown near the bottom of the page, before the footer. '
                    'Collapsed behind a "See more" toggle when long.'),
    )
    feature_image = models.ImageField(
        upload_to='seo/brand/',
        blank=True,
        null=True,
        verbose_name=_('Feature Image'),
        help_text=_(
            'Image shown when this brand\'s listing page is shared on social '
            'media (recommended: 1200×630 px). Separate from the logo above.'
        ),
    )
    feature_image_alt = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        default=None,
        verbose_name=_('Feature Image ALT Text'),
    )
    seo_updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Car Brand"
        verbose_name_plural = "Car Brands"
        db_table = "tbl_brand"
        indexes = [
            models.Index(fields=['status']),
        ]
