import useAxios from "./APIConstant.js";

const getAllPenitip = async () => { 
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

const getPenitipByPage = async (page = 0) => { 
  try { 
    const response = await useAxios.get("/paginate/penitip", {
      params: {
        page: page,
      }, 
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

const createPenitip = async (data) => { 
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

const updatePenitip = async (data, id_penitip) => { 
  try { 
    const response = await useAxios.put(`/penitip/${id_penitip}`, data, { 
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

const deletePenitip = async (id) => { 
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
  getAllPenitip,
  getPenitipByPage,
  createPenitip,
  updatePenitip,
  deletePenitip,
};

export default APIPenitip;