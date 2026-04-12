import pycountry

def get_countries():
    result = []
    for country in pycountry.countries:
        result.append({
            "name": country.name,
            "shortcut": country.alpha_2
        })
    return result