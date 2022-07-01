// To get all the student vaccination data
export function getStudentsVaccinationDetails() {
    return fetch("http://localhost:8081/student-vaccination").then(res => res.json()).then(result => {
        return result;
    }).catch(console.log);
}

