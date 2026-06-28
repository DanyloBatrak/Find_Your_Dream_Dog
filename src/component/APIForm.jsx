import { useState } from "react";

const APIForm = () => {
  const [ban, setBan] = useState([]);
  const [animal, setAnimal] = useState(null);
  const [image, setImage] = useState(null);
  const [prevDog, setPrevDog] = useState([]);

  const ID_Link = "https://api.thedogapi.com/v1/breeds";

  async function handleDiscovery() {
    const resourse = await fetch(ID_Link, {
      headers: {
        "x-api-key": import.meta.env.VITE_APP_ACCESS_KEY,
      },
    });

    if (!resourse.ok) {
      console.error("Request failed:", resourse.status);
      return;
    }

    const data = await resourse.json();

    const availableDogs = data.filter(dog => {
      const temperament = dog.temperament
        ? dog.temperament.split(",")[0]
        : "Unknown";

      const origin = dog.origin ? dog.origin.split(",")[0] : "Unknown";

      return (
        !ban.includes(dog.name) &&
        !ban.includes(dog.life_span) &&
        !ban.includes(temperament) &&
        !ban.includes(origin)
      );
    });

    if (availableDogs.length === 0) {
      alert("No available dogs");
      return;
    }

    const randomDog =
      availableDogs[Math.floor(Math.random() * availableDogs.length)];

    const handleURL = await fetch(
      `https://api.thedogapi.com/v1/images/search?breed_ids=${randomDog.id}`,
      {
        headers: {
          "x-api-key": import.meta.env.VITE_APP_ACCESS_KEY,
        },
      },
    );

    const dogImage = await handleURL.json();

    if (animal) {
      setPrevDog(prev => [
        ...prev,
        {
          name: animal.name,
          origin: animal.origin?.split(",")[0] || "Unknown",
          temperament: animal.temperament?.split(",")[0] || "Unknown",
          life_span: animal.life_span,
          image,
        },
      ]);
    }

    setAnimal(randomDog);

    if (dogImage.length === 0) {
      handleDiscovery();
      return;
    }

    setImage(dogImage[0].url);
  }

  function handleBan(value) {
    if (ban.includes(value)) {
      setBan(ban.filter(item => item !== value));
    } else {
      setBan([...ban, value]);
    }
  }

  return (
    <div className="layout">
      <div className="ban-window">
        <h2>Ban List</h2>
        <p>Choose the attribute in your listing to ban it</p>
        {ban.map((item, index) => (
          <button
            key={index}
            onClick={() => handleBan(item)}
            className="traits-button"
          >
            {item.split(",")[0]}
          </button>
        ))}
      </div>
      <div className="container">
        <div>
          {animal && (
            <div className="traits">
              <img src={image} alt="dog-image" />

              <button
                onClick={() => handleBan(animal.name)}
                className="traits-button"
              >
                {animal.name}
              </button>
              <button
                onClick={() => handleBan(animal.life_span)}
                className="traits-button"
              >
                {animal.life_span}
              </button>
              <button
                onClick={() =>
                  handleBan(animal.temperament?.split(",")[0] || "Unknown")
                }
                className="traits-button"
              >
                {animal.temperament?.split(",")[0] || "Unknown"}
              </button>
              <button
                onClick={() =>
                  handleBan(animal.origin?.split(",")[0] || "Unknown")
                }
                className="traits-button"
              >
                {animal.origin?.split(",")[0] || "Unknown"}
              </button>
            </div>
          )}
        </div>
        <div>
          <button className="discover_button" onClick={handleDiscovery}>
            Discover
          </button>
        </div>
      </div>
      <div className="history">
        <h2 id="history-text">What you found so far</h2>

        {prevDog.map((dog, index) => (
          <div key={index}>
            <img className="history_img" src={dog.image} alt="dog-image" />

            <p>
              A {dog.name} dog from {dog.origin?.split(",")[0] || "Unknown"}
            </p>
            <p>Temperament: {dog.temperament?.split(",")[0] || "Unknown"}</p>
            <p>Life span: {dog.life_span}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default APIForm;
