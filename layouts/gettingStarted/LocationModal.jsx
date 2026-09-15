import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../styles/SignupMoreDetail.module.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useFormik } from 'formik';
import { registerLocation } from '../../lib/validate';
import { ContextProvider } from "../../global/context";
import { Country, State, City } from "country-state-city";

function LocationModal({ setLocationModal }) {
    const { selectedLocation, setSelectedLocation } = useContext(ContextProvider);

    const [selectOption, setSelectOption] = useState(selectedLocation.country)
    const [selectCity, setSelectCity] = useState(selectedLocation.city)
    const countryRef = useRef(null)
    const cityRef = useRef(null)
    const [dropdown, setDropdown] = useState(false)
    const [dropdownCity, setDropdownCity] = useState(false)

    // customize country-state-city lib
    const countries = Country.getAllCountries();
    const filtered = countries.filter((cc) => cc.name === selectOption);
    const countryStates = State.getStatesOfCountry(filtered[0]?.isoCode);
    const countryCities = City.getCitiesOfCountry(filtered[0]?.isoCode);

    const filteredCountries = countries.filter((option) =>
        option.name.toLowerCase().startsWith(selectOption.toLowerCase())
    );

    const filteredCities = countryCities.filter((option) =>
        option.name.toLowerCase().startsWith(selectCity.toLowerCase())
    );

    //closing the model
    const closeModel = (event) => {
        const className = event.target.getAttribute("id");
        if (className === "help_modalOuter") {
            setLocationModal(false)

        }
    }

    useEffect(() => {
        formik.setFieldValue('country', selectOption);
        formik.setFieldValue("city", selectCity);

    }, [selectOption, selectCity])

    //handle dropdown
    const handleClickOutside = (e) => {
        if (!countryRef.current.contains(e.target)) {
            setDropdown(false)
        }
        if (!cityRef.current.contains(e.target)) {
            setDropdownCity(false)

        }
    }
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    });

    const FindCountry = (e) => {
        setSelectOption(e.target.value)
        const filteredCountries = countries.filter((option) =>
            option.name.toLowerCase().startsWith(e.target.value.toLowerCase())
        );
        if (e.target.value.length > 0) {
            if (filteredCountries.length > 0) {
                setDropdown(true)

            } else {
                setDropdown(false)

            }
        }
        else {
            setDropdown(false)
            formik.setFieldValue('country', '');
        }
    }

    const FindCity = (e) => {
        setSelectCity(e.target.value)
        const filteredCities = countryCities.filter((option) =>
            option.name.toLowerCase().startsWith(selectCity.toLowerCase())
        );

        if (e.target.value.length > 0) {
            if (filteredCities.length > 0) {
                setDropdownCity(true)
            } else {
                setDropdownCity(false)
            }

        }
        else {
            setDropdownCity(false)
            formik.setFieldValue('city', '');
        }
    }

    const formik = useFormik({
        initialValues: {
            country: "",
            city: "",

        },
        validate: registerLocation,
        onSubmit
    });
    async function onSubmit(values) {
        setSelectedLocation({ ...selectedLocation, "country": " "+values.country, "city": values.city })
        setLocationModal(false);
    };

    return (
        <>

            <div id="help_modalOuter" className={styles.help_modalOuter} onClick={closeModel} >
                <div className={styles.skillModal_center}>
                    <div className={styles.help_cross} onClick={() => setLocationModal(false)}>
                        <AiOutlineCloseCircle className={styles.svg_cross} />
                    </div>
                    <div className={styles.dropTop_line} />
                    <div className={styles.addYour_skills}>
                        <p>Explore the remarkable individuals in your area.</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} autoComplete="" className={styles.countryDropDown_form} >
                        <div className={styles.country_dropDown} ref={countryRef} >

                            <div className={styles.input_bx}>
                                <input
                                    type="option"
                                    id="country"
                                    name="country"
                                    required="required"
                                    value={selectOption} // Use selectedOption here
                                    onClick={FindCountry}
                                    onChange={FindCountry}
                                    onBlur={formik.handleBlur}
                                    autoFocus
                                    // {...formik.getFieldProps('designation')}
                                    style={formik.errors.country && formik.touched.country ? { outline: '1px solid red' } : null}

                                />
                                <span className={styles.label}>Country</span>

                                {dropdown && (
                                    <div className={styles.options} style={{ overflowY: `${filteredCountries.length > 7 ? 'scroll' : 'hidden'}` }}>
                                        {filteredCountries.map((option, index) => {

                                            return (
                                                <div className={styles.dropdown_item}
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectOption(option.name)
                                                        formik.setFieldValue('country', option.name);
                                                        setDropdown(false)
                                                    }} >
                                                    {option.name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.country_dropDown} ref={cityRef} >

                            <div className={styles.input_bx}>
                                <input
                                    type="option"
                                    id="city"
                                    name="city"
                                    required="required"
                                    value={selectCity} // Use selectedOption here
                                    onClick={FindCity}
                                    onChange={FindCity}
                                    onBlur={formik.handleBlur}
                                    style={formik.errors.city && formik.touched.city ? { outline: '1px solid red' } : null}

                                />
                                <span className={styles.label}>City/District</span>

                                {dropdownCity && (
                                    <div className={styles.options} style={{ overflowY: `${filteredCities.length > 7 ? 'scroll' : 'hidden'}` }}>
                                        {filteredCities.map((option, index) => {
                                            const filteredState = countryStates.find(
                                                (state) => state.isoCode === option.stateCode
                                            );
                                            const selectedName = `${option.name}, ${filteredState.name}`;
                                            return (
                                                <div className={styles.dropdown_item}
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectCity(selectedName)
                                                        formik.setFieldValue('city', selectedName);
                                                        setDropdownCity(false)
                                                    }} >
                                                    {selectedName}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit">Next</button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default LocationModal