// To get all the student vaccination data
export function getStudentsVaccinationMetadata() {
    return fetch("http://localhost:8081/student-vaccination-metadata").then(res => res.json()).then(result => {
        return result;
    }).catch(console.log);
}

