import pytest

def test_lookup_by_nip_invalid_nip(seeded_client, auth_header):
    """Should return 400 for an invalid NIP format."""
    invalid_nip = "1234"
    response = seeded_client.get(f"/lookup/nip/{invalid_nip}", headers=auth_header)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert data["error"] == "Wrong NIP."
