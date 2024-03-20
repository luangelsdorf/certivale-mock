"use client";

import {
  checkoutSale,
  createSale,
  createSchedule,
  downloadNfsePdf,
  finalizeSale,
  getSchedule,
  paySale,
  reset,
} from "@/services/global.service";
import styles from "./page.module.css";

export default function Home() {
  const createScheduleHandler = async () => {
    await createSchedule();
    await createSale();
    await getSchedule();
    alert("Agendamento criado com sucesso, verifique o e-mail");
  };

  const paySaleHandler = async () => {
    await paySale();
    alert("Venda paga com sucesso");
  };

  const checkoutSaleHandler = async () => {
    await checkoutSale();
    alert("Protocolo gerado com sucesso");
  };

  const finalizeSaleHandler = async () => {
    await finalizeSale();
    alert("Venda finalizada com sucesso");
  };

  const downloadNfsePdfHandler = async () => {
    const blob = await downloadNfsePdf();
    if (!blob) {
      alert("Erro ao baixar NFSe");
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const resetHandler = async () => {
    await reset();
  };

  return (
    <main className={styles.main}>
      <button className={styles.button} onClick={createScheduleHandler}>
        Criar agendamento
      </button>
      <button className={styles.button} onClick={paySaleHandler}>
        Pagar venda
      </button>
      <button className={styles.button} onClick={checkoutSaleHandler}>
        Checkout
      </button>
      <button className={styles.button} onClick={finalizeSaleHandler}>
        Finalizar venda
      </button>
      <button className={styles.button} onClick={downloadNfsePdfHandler}>
        Download NFSe
      </button>
      <button className={styles.button} onClick={resetHandler}>
        Reset
      </button>
    </main>
  );
}
