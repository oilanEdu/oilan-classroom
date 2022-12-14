const endPoint = "https://prod-in2.100ms.live/hmsapi/testdomain.app.100ms.live/";
export default async function GetToken(role) {
    const response = await fetch(`${endPoint}api/token`, {
        method: 'POST',
        body: JSON.stringify({
         user_id: '2234', // a reference user id assigned by you
             role: "teacher", // stage, viewer 
         room_id: "6397fa226d95375c45153bfa" // copied from the dashboard
        }),
    });
    const { token } = await response.json();
    console.log('TOKEN!', token)
}  