document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("CountryName");
    const submitButton = document.querySelector("button"); // Select the existing button

    const countryInfoSection = document.getElementById("country-info");
    const borderingCountriesSection = document.getElementById("bordering-countries");

    // Add event listener to submit button
    submitButton.addEventListener("click", () => {
        const countryName = inputField.value.trim();
        if (countryName) {
            fetchCountryData(countryName);
        } else {
            alert("Please enter a country name.");
        }
    });

    // Function to fetch country data
    function fetchCountryData(country) {
        fetch(`https://restcountries.com/v3.1/name/${country}`)
            .then(response => {
                if (!response.ok) throw new Error("Country not found.");
                return response.json();
            })
            .then(data => {
                const countryData = data[0];
                displayCountryInfo(countryData); // Display country info
                fetchBorderCountries(countryData.borders || []); // Fetch bordering countries
            })
            .catch(error => {
                countryInfoSection.innerHTML = `<p style="color:red;">${error.message}</p>`;
                borderingCountriesSection.innerHTML = ""; // Clear any previous data
            });
    }

    // Function to display country information
    function displayCountryInfo(country) {
        countryInfoSection.innerHTML = `
            <h2>Country Details</h2>
            <p><b>Capital:</b> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><b>Population:</b> ${country.population.toLocaleString()}</p>
            <p><b>Region:</b> ${country.region}</p>
            <p><b>Flag:</b></p>
            <img src="${country.flags?.svg}" alt="Flag of ${country.name.common}" width="150">
        `;
    }

    // Function to fetch and display bordering countries
    function fetchBorderCountries(borders) {
        borderingCountriesSection.innerHTML = "<h2>Bordering Countries</h2>";

        if (!borders.length) {
            borderingCountriesSection.innerHTML += "<p>No bordering countries.</p>";
            return;
        }

        // Fetch data for each bordering country
        Promise.all(borders.map(border => 
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                .then(response => response.json())
        ))
        .then(borderData => {
            borderData.forEach(data => {
                const borderCountry = data[0];
                borderingCountriesSection.innerHTML += `
                    <li>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}" width="80">
                    </li>
                `;
            });
        });
    }
});
