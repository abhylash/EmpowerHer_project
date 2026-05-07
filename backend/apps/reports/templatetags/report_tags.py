from django import template

register = template.Library()

@register.filter
def multiply(value, arg):
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return 0

@register.filter(name='sum')
def sum_attr(queryset, field):
    try:
        total = 0
        for item in queryset:
            val = getattr(item, field, 0)
            if val is not None:
                total += float(val)
        return total
    except (ValueError, TypeError):
        return 0
