import React, { useState, useEffect } from 'react';
import { Typography, MenuItem, Button, Grid, Select, InputLabel } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormInput from './CustomTextField';
import { commerce } from '../../lib/commerce';
const AddressForm =({ checkoutToken, next }) => {
  const methods = useForm();
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');

  const fetchShippingCountries = async(checkoutTokenId)=>{
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  }
  const fetchSubdivisions = async(countryCode)=>{
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
    setShippingCountries(subdivisions);
    setShippingCountry(Object.keys(subdivisions)[0]);
  }
  const fetchShippingOptions = async(checkoutTokenId, country, region = null)=>{
    const { options } = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region });
    setShippingOption(options);
    setShippingOption(options[0].id);
  }
  const options = shippingOptions.map((sO) =>(
    {
      id: sO.id,
      label: `${sO.description}-(${sO.price.formatted_with_symbol})`,
  }
  ))
  useEffect(()=> {
    fetchShippingCountries(checkoutToken.id);
  }, []);
  useEffect(()=> {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);
  useEffect(() => {
  if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
}, [shippingSubdivision]);
  return(
    <>
    <Typography variant="h6" gutterBottom>Shipping Address</Typography>
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data)=>next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
      <Grid container spacing={3}>
        <FormInput required name="firstName" label="First name" />
        <FormInput required name="lastName" label="Last name" />
        <FormInput required name="address1" label="Address" />
        <FormInput required name="email" label="email" />
        <FormInput required name="city" label="City" />
        <FormInput required name="zip" label="ZIP / Postal code" />
        <Grid item xs={12} sm={6}>
          <InputLabel>Shipping Country</InputLabel>
          <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
          {shippingCountries.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {country.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Shipping Subdivision</InputLabel>
          <Select value={shippingSubdivisions} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
              {shippingSubdivisions.map((subdivision) => (
              <MenuItem key={subdivision.id} value={subdivision.id}>
                {subdivision.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Shipping Options</InputLabel>
          <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
          {shippingOptions.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
          </Select>
        </Grid>
      </Grid>
      <br />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
      <Button type="submit" variant="contained" color="primary">Next</Button>
      </div>
      </form>
    </FormProvider>
    </>
  )
}
export default AddressForm;
