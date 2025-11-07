import Calendar from "../Components/Search/Calendar/Calendar";

export default function Test() {
  // Add this at the top of your file or in a separate test file

  const fakeData = {
    startDate: new Date("2024-01-01"),

    intervalos: [
      {
        id: 1,
        dataInicio: new Date("2024-01-15"),
        dataTermino: new Date("2024-01-20"),
        causaInicio: "Falta de pagamento",
        causaTermino: "Pagamento realizado",
        pagamentoTermino: null,
      },
      {
        id: 2,
        dataInicio: new Date("2024-02-05"),
        dataTermino: new Date("2024-02-12"),
        causaInicio: "Atraso na fatura",
        causaTermino: "Regularizado",
        pagamentoTermino: null,
      },
      {
        id: 3,
        dataInicio: new Date("2024-03-01"),
        dataTermino: new Date("2024-03-10"),
        causaInicio: "Inadimplência",
        causaTermino: null,
        pagamentoTermino: null,
      },
    ],

    eventos: [
      {
        date: new Date("2024-01-18"),
        label: "Evento 1",
        onClick: () => console.log("Clicked event 1"),
      },
      {
        date: new Date("2024-01-18"),
        label: "Evento 2",
        onClick: () => console.log("Clicked event 2"),
      },
      {
        date: new Date("2024-02-08"),
        label: "Evento 3",
        onClick: () => console.log("Clicked event 3"),
      },
      {
        date: new Date("2024-03-05"),
        label: "Evento 4",
        onClick: () => console.log("Clicked event 4"),
      },
    ],
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Calendar
        startDate={fakeData.startDate}
        intervalos={fakeData.intervalos}
        eventos={fakeData.eventos}
      />
    </div>
  );
}
