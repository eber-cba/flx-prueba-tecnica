import img from "../../assets/gatito.jpg";

const Error404 = () => {
  return (
    <div style={styles.error404}>
      <div style={styles.container}>
        <h1 style={styles.h1}>¡Ups!</h1>
        <h2 style={styles.h2}>Parece que te has perdido...</h2>
        <img src={img} alt='Gato adorable' style={styles.img} />
        <p style={styles.p}>No te preocupes, a veces sucede. </p>
        <p style={styles.p}>
          Puedes volver a la página de inicio haciendo clic aquí abajo:
        </p>
        <ul style={styles.ul}>
          <li style={styles.liInicio}>
            <a href='/'>Inicio</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
const styles = {
  error404: {
    backgroundColor: "#f7f7f7",
    padding: "20px",
    textAlign: "center",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  h1: {
    fontSize: "3em",
    fontWeight: "bold",
    color: "#f06292",
  },
  h2: {
    fontSize: "2em",
    color: "#444",
  },
  img: {
    width: "500px",
    margin: "20px auto",
  },
  p: {
    fontSize: "1.5em",
    lineHeight: "1.5",
  },
  ul: {
    listStyle: "none",
    padding: "0",
  },
  li: {
    display: "inline-block",
    margin: "10px",
  },
  liInicio: {
    display: "inline-block",
    margin: "10px",
    fontWeight: "bold", // Agregar negrita al enlace "Inicio"
    textDecoration: "underline", // Agregar subrayado al enlace "Inicio"
  },
  a: {
    fontSize: "1.2em",
    color: "#444",
    textDecoration: "none",
  },
};

export default Error404;
