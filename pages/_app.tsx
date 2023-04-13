import type { AppProps } from 'next/app';
import {useState, useEffect} from 'react';
import "./App.css";
import { Configuration, OpenAIApi } from 'openai';
import getConfig from 'next/config';

export default function App({ Component, pageProps }: AppProps) {

  const [result, setResult] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvPR3LaVMdgtqFkscy53W9YjN-rnN0eI6B2lKKdXzxeqIo0efbzFK3RGmEyC5X86W6Khk&usqp=CAU");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("")
  const text = "Creating your image, please wait "

  //Extracting public runtime from getConfig

  const { publicRuntimeConfig } = getConfig();

  const apiKey = (typeof publicRuntimeConfig !== 'undefined' && publicRuntimeConfig.apiKey) ? publicRuntimeConfig.apiKey : process.env.API_KEY;

  if( !apiKey){
    throw new Error('apiKey is not defined in config file')
  }

  const configuration = new Configuration({apiKey})
  const openai = new OpenAIApi(configuration)
  const generateImage = async () => {

    //while there is not an image, display the loading image

    setLoading(true)

    //request being made to the openai API 

    const res = await openai.createImage({
      prompt: prompt,
      n:1,
      size:"512x512"
  })
    //set the loading back to false
    setLoading(false)

    const data = res.data;
    console.log(data)
    setResult(data.data[0].url || "no image found")
  }

  useEffect(() => {

    if(loading){
      let i = 0;

      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if(i > text.length){
          i = 0
          setTypedText("")
        }
      }, 100); 
      return () => clearInterval(typing)

    }

    //Write some logic here for now..

  }, [loading])

  const sendEmail = (url = "") => {
    const message = `Here's your image download link: ${url}`;
    window.location.href = `mailto:someone@example.com?subject=Image Download Link&body=${message}`
  }

  return <div className='app-main'>
    <h2>Manu's Mental Image Creation Portal</h2>
    <textarea
      className='app-input'
      placeholder='In this box, input the text content for the image you want to create. Be descriptive as possible'
      onChange={(e) => setPrompt(e.target.value)}
    />
    <button onClick={generateImage}>Generate Image</button>

    {/* Ternary statement which displays the loading text, OR the generated image for the user */}

    <>{loading ? (
      <>
      <h3>{typedText}</h3>
      <div className='lds-ripple'>
        <div></div>
        <div></div>
      </div>
      </>
    )
    : <img src = {result} onClick={() => sendEmail(result)} style={{cursor: "pointer"}} className = "result-image" alt = "result"/>
}
    </>
  </div>
}
