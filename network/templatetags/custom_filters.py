from django import template

register = template.Library()

# get pagination range
@register.filter
def get_range(current_page, num_pages):
    '''
    Returns a range of page numbers to display in the pagination bar.
    Used to generate .page-item elements in the pagination bar.
    '''
    
    if current_page <= 5:
        return range(1, min(10, num_pages) + 1)
    elif current_page >= num_pages - 5:
        return range(num_pages - 9, num_pages + 1)
    else:
        return range(current_page - 4, current_page + 6)