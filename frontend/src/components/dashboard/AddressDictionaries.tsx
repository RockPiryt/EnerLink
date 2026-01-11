import React from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap';
import CityList from '../dictionary/CityList';
import CountryList from '../dictionary/CountryList';
import DistrictList from '../dictionary/DistrictList';
import PKWiUList from '../pkwiu/PKWiUList';
import TariffList from '../tariff/TariffList';

const AddressDictionaries: React.FC = () => {
  return (
    <Card className="my-4">
      <Card.Header>
        <h4 className="mb-0">Address Dictionaries</h4>
      </Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="cities" id="address-dictionaries-tabs" className="mb-3">
          <Tab eventKey="cities" title="Cities">
            <CityList />
          </Tab>
          <Tab eventKey="countries" title="Countries">
            <CountryList />
          </Tab>
          <Tab eventKey="districts" title="Provinces">
            <DistrictList />
          </Tab>
          <Tab eventKey="pkwiu" title="PKWiU">
            <PKWiUList />
          </Tab>
          <Tab eventKey="tariffs" title="Energy Tariffs">
            <TariffList />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default AddressDictionaries;
