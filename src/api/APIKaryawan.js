import useAxios from "./APIConstant";

const getAllKaryawan = async () => {
    try { 
        const response = await useAxios.get("/karyawan", { 
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

const getKaryawanByPage = async (page = 0) => { 
    try { 
      const response = await useAxios.get("/paginate/karyawan", {
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

const searchKaryawan = async (search) => { 
    try { 
      const response = await useAxios.get(`/karyawan/search/${search}`, {
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

const createKaryawan = async (data) => { 
    try { 
      const response = await useAxios.post("/karyawan", data, { 
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

const updateKaryawan = async (data, id_karyawan) => { 
    try { 
      const response = await useAxios.put(`/karyawan/${id_karayawan}`, data, { 
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
  
  const deleteKaryawan = async (id) => { 
      try { 
      const response = await useAxios.delete(`/karyawan/${id}`, { 
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

const APIKaryawan = {
    getAllKaryawan,
    getKaryawanByPage,
    searchKaryawan,
    createKaryawan,
    updateKaryawan,
    deleteKaryawan,
};

export default APIKaryawan;