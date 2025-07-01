import logging
from typing import Optional

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from main.models import ProductStock

logger = logging.getLogger(__name__)


def send_stock_notification(product_stock: ProductStock, recipient_email: Optional[str] = None) -> None:
    if product_stock.quantity >= 5:
        return

    context = {
        "product": product_stock.product,
        "warehouse": product_stock.warehouse,
        "quantity": product_stock.quantity,
        "threshold": 5,
    }

    subject = f"Low stock alert: {product_stock.product.name}"
    text_message = (
        f"Product: {product_stock.product.name}\n"
        f"Warehouse: {product_stock.warehouse.name}\n"
        f"Current stock: {product_stock.quantity} units\n\n"
        f"Please restock soon!"
    )
    html_message = render_to_string("email_templates/low_stock_alert.html", context)
    recipients = ["stepanborodic@gmail.com"]

    if not recipients:
        admin_email = getattr(settings, "ADMIN_EMAIL", None)
        if admin_email:
            recipients = [admin_email]
        else:
            logger.warning(f"No recipients found for low stock notification of {product_stock.product.name}")
            return

    try:
        email = EmailMultiAlternatives(
            subject=subject, body=text_message, from_email=settings.DEFAULT_FROM_EMAIL, to=recipients
        )
        email.attach_alternative(html_message, "text/html")
        email.send()
    except Exception as e:
        logger.error(f"Failed to send low stock notification: {str(e)}")
