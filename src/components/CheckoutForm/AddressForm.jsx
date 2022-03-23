import React, { useEffect, useState } from "react";
import {
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import FormInput from "./FormInput";
import { useForm, FormProvider } from "react-hook-form";

import { commerce } from "../../lib/commerce";

const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState("");
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState("");
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState("");

    const methods = useForm();

    const countries = Object.entries(shippingCountries).map(
        ([countryCode, countryName]) => ({
            id: countryCode,
            label: countryName,
        })
    );

    const subdivisions = Object.entries(shippingSubdivisions).map(
        ([code, name]) => ({
            id: code,
            label: name,
        })
    );

    const options = shippingOptions.map((options) => ({
        id: options.id,
        label: `${options.description} - (${options.price.formatted_with_symbol})`,
    }));

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } =
            await commerce.services.localeListShippingCountries(
                checkoutTokenId
            );
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    };

    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(
            countryCode
        );

        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    };

    const fetchShippingOptions = async (
        checkoutTokenId,
        country,
        region = null
    ) => {
        const options = await commerce.checkout.getShippingOptions(
            checkoutTokenId,
            { country, region }
        );

        setShippingOptions(options);
        setShippingOption(options[0]);
    };

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, []);

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry);
    }, [shippingCountry]);

    useEffect(() => {
        if (shippingSubdivision)
            fetchShippingOptions(
                checkoutToken.is,
                shippingCountry,
                shippingSubdivision
            );
    }, [shippingSubdivision]);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Shipping Address
            </Typography>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit((data) =>
                        next({
                            ...data,
                            shippingCountry,
                            shippingSubdivision,
                            shippingOption,
                        })
                    )}
                >
                    <Grid container spacing={3}>
                        <FormInput
                            required
                            name="firstname"
                            label="First Name"
                        />
                        <FormInput required name="lastname" label="Last Name" />
                        <FormInput
                            required
                            name="address1"
                            label="Street Address"
                        />
                        <FormInput
                            name="address2"
                            label="Street Address Line 2"
                        />
                        <FormInput required name="email" label="Email" />
                        <FormInput required name="city" label="City" />
                        <FormInput required name="zip" label="Postal Code" />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select
                                value={shippingCountry}
                                fullWidth
                                onChange={(e) =>
                                    setShippingCountry(e.target.value)
                                }
                            >
                                {countries.map((country) => (
                                    <MenuItem
                                        key={country.id}
                                        value={country.id}
                                    >
                                        {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select
                                value={shippingSubdivision}
                                fullWidth
                                onChange={(e) =>
                                    setShippingSubdivision(e.target.value)
                                }
                            >
                                {subdivisions.map((subdivision) => (
                                    <MenuItem
                                        key={subdivision.id}
                                        value={subdivision.id}
                                    >
                                        {subdivision.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select
                                value={shippingOption}
                                fullWidth
                                onChange={(e) =>
                                    setShippingOption(e.target.value)
                                }
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button component={Link} to="/cart" variant="outlined">
                            Back to Cart
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Next
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};

export default AddressForm;