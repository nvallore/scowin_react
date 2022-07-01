// To get details of vaccination drive
export function getVaccinationDriveDetails() {
    return fetch("http://localhost:8081/vaccination-drive").then(res => res.json()).then(result => {
        return result;
    }).catch(console.log);
}

// To add new vaccination drive
export function addVaccinationDrive(requestBody) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    };
    return fetch('http://localhost:8081/vaccination-drive', requestOptions)
        .then(response => response.json())
        .then(data => data).catch(console.log);
}

// To edit details of vaccination drive
export function editVaccinationDrive(requestBody) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    };
    return fetch(`http://localhost:8081/vaccination-drive/${requestBody.id}`, requestOptions)
        .then(response => response.json())
        .then(data => data).catch(console.log);
}
