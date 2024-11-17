import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "/components/ui/avatar";
import { Button } from "/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";

const SmileApp = () => {
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [videoRef, setVideoRef] = useState(null);

  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setStream(stream);
          if (videoRef) {
            videoRef.srcObject = stream;
          }
        })
        .catch((error) => console.error(error));
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  }, [isCameraOn, videoRef]);

  const handleTakePicture = () => {
    if (stream && videoRef) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => setImage(blob));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPost = { image, name, amount };
    setPosts([newPost, ...posts]);
    setImage(null);
    setName('');
    setAmount('');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Smile to Make Money</CardTitle>
          <CardDescription>Post your smile and earn money!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {isCameraOn ? (
              <video
                autoPlay
                playsInline
                width={400}
                height={300}
                ref={(ref) => setVideoRef(ref)}
                className="rounded-lg"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-64 h-48" />
            )}
            <div className="flex space-x-4">
              <Button onClick={() => setIsCameraOn(!isCameraOn)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</Button>
              {isCameraOn && (
                <Button onClick={handleTakePicture} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Take Picture</Button>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="name" className="text-gray-700">Your name:</Label>
              <Input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} className="bg-gray-200 border-2 border-gray-400 rounded-lg p-2" />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="amount" className="text-gray-700">Amount earned:</Label>
              <Input type="number" id="amount" value={amount} onChange={(event) => setAmount(event.target.value)} className="bg-gray-200 border-2 border-gray-400 rounded-lg p-2" />
            </div>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">Post your smile</Button>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{post.name}</CardTitle>
              <CardDescription>Earned: ${post.amount}</CardDescription>
            </CardHeader>
            <CardContent>
              <Avatar>
                <AvatarImage src={URL.createObjectURL(post.image)} />
                <AvatarFallback>{post.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmileApp;