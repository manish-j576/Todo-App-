  
    async function signup(){
        console.log("hello world")
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;
        let response= await axios.post("http://localhost:8080/signup",{
            username,
            password
        })
        document.getElementById("signup-username").value="";
        document.getElementById("signup-password").value="";
        console.log(response.data)


        
    }
    document.getElementById("signUp-btn").addEventListener("click",signup)
    async function signin(){
     
        const username = document.getElementById("signin-username").value;
        const password = document.getElementById("signin-password").value;
       let response =  await axios.post("http://localhost:8080/signin",{
            username,
            password
        })
        document.getElementById("signin-username").value="";
        document.getElementById("signin-password").value="";
        let token= response.data.token
        console.log(token)
        localStorage.setItem("token",token);
        response = await axios.get("http://localhost:8080/home",{
            headers: {
                token
            }
        })
        document.body.innerHTML = response.data;
        

        
    }
    document.getElementById("signIn-btn").addEventListener("click",signin)
