"use server";
import { cookies } from "next/headers";

export async function createSchedule() {
  "use server";
  const response = await fetch(`${process.env.BASE_URL}/v1/schedules/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      user_id: "e3fc75bf-05ee-46d6-9903-7a9345c9ce7d",
      person_id: "a0ee65b5-7c0e-4ca0-ac8d-ad2c0f18a499",
      accountant_id: "998783ad-cf68-423f-86f3-3bb671224988",
      subsidiary_id: "8f187ae7-8ff3-4c05-a691-1d4dbf85ab01",
      schedule_status: "A",
      schedule_type: "A",
      description: "Leonardo da Empresa X",
      date_time: "2024-10-18T12:30:00",
    }),
  });

  if (response.status === 201) {
    const location = response.headers.get("Location")?.split("/").pop();
    cookies().set("schedule_id", location ?? "");
    return location;
  } else {
    return null;
  }
}

export async function getSchedule() {
  "use server";
  const cookieStore = cookies();
  const id = cookieStore.get("schedule_id");
  const response = await fetch(`${process.env.BASE_URL}/v1/schedules/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.status === 200) {
    const json = await response.json();
    cookieStore.set("schedule", json);
    return response.json();
  } else {
    return null;
  }
}

export async function createSale() {
  "use server";
  const cookieStore = cookies();
  const schedule_id = cookieStore.get("schedule_id");
  const response = await fetch(`${process.env.BASE_URL}/v1/sales/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      person_id: "a0ee65b5-7c0e-4ca0-ac8d-ad2c0f18a499",
      schedule_id,
      product_id: 1,
    }),
  });

  if (response.status === 201) {
    const location = response.headers.get("Location")?.split("/").pop();
    cookieStore.set("sale_id", location ?? "");
    return response.headers.get("Location")?.split("/").pop();
  } else {
    return null;
  }
}

export async function paySale() {
  "use server";
  const id = cookies().get("sale_id");
  const response = await fetch(`${process.env.BASE_URL}/v1/sales/${id}/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      body: JSON.stringify({
        payment_method: 2,
        is_face_to_face: false,
        holder: "João Roberto Matias",
        card_number: "5262847262125481",
        expiration_date: "12/2027",
        cvv: "636",
      }),
    },
  });

  if (response.status === 200) {
    return response.json();
  } else {
    return null;
  }
}

export async function checkoutSale() {
  "use server";
  const id = cookies().get("sale_id");
  const response = await fetch(`${process.env.BASE_URL}/v1/sales/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      body: JSON.stringify({
        id,
        checkout_type: "1",
      }),
    },
  });

  if (response.status === 200) {
    return response.json();
  } else {
    return null;
  }
}

export async function finalizeSale() {
  "use server";
  const id = cookies().get("sale_id");
  const response = await fetch(
    `${process.env.BASE_URL}/v1/sales/${id}/finalize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (response.status === 200) {
    return response.json();
  } else {
    return null;
  }
}

export async function downloadNfsePdf() {
  "use server";
  const id = cookies().get("sale_id");
  const response = await fetch(
    `${process.env.BASE_URL}/v1/sales/${id}/download/nfse`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (response.status === 200) {
    return response.blob();
  } else {
    return null;
  }
}

export async function reset() {
  "use server";
  const cookieStore = cookies();
  const id = cookieStore.get("schedule_id");
  await fetch(`${process.env.BASE_URL}/v1/schedules/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  cookieStore.delete("schedule_id");
  cookieStore.delete("schedule");
  cookieStore.delete("sale_id");
}

export async function getToken() {
  "use server";
  return `${process.env.TOKEN}`;
}
