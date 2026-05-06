def test_print_all_routes(app):
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule}")
    # Test always passes, just for debug
    assert True
