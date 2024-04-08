import useAxios from "./APIConstant.js";

const GetAllPenitip = async () => { 
    try { 
      const response = await useAxios.get("/penitip", { 
        headers: { 
          "Content-Type": "application/json", 
        //   Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
        }, 
      }); 
      return response.data.data; 
    } catch (error) { 
      throw error.response.data; 
    } 
};

const CreatePenitip = async (data) => { 
  try { 
    const response = await useAxios.post("/penitip", data, { 
      headers: { 
        "Content-Type": "multipart/form-data", 
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
      }, 
    }); 
    return response.data; 
  } catch (error) { 
    throw error.response.data; 
  } 
}; 

const UpdatePenitip = async (values, id_penitip) => { 
  try { 
    console.log(id_penitip, values.no_telp);
    const response = await useAxios.put(`/penitip/${id_penitip}`, values, { 
      headers: { 
        "Content-Type": "application/json", 
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
      }, 
    }); 
    return response.data; 
  } catch (error) { 
    throw error.response.data; 
  } 
}; 

const DeletePenitip = async (id) => { 
  await new Promise((resolve) => setTimeout(resolve, 1000)); 
 
  try { 
    const response = await useAxios.delete(`/penitip/${id}`, { 
      headers: { 
        "Content-Type": "application/json", 
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
      }, 
    }); 
    return response.data; 
  } catch (error) { 
    throw error.response.data; 
  } 
}; 

const APIPenitip = {
  GetAllPenitip,
  CreatePenitip,
  UpdatePenitip,
  DeletePenitip,
};

export default APIPenitip;