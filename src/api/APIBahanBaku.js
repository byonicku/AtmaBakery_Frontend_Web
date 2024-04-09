import useAxios from "./APIConstant";

const getAllBahanBaku = async () => {
    try { 
        const response = await useAxios.get("/bahan_baku", { 
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

const getBahanBakuByPage = async (page = 0) => { 
    try { 
      const response = await useAxios.get("/paginate/bahan_baku", {
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

const searchBahanBaku = async (search) => { 
    try { 
      const response = await useAxios.get(`/bahan_baku/search/${search}`, {
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

const createBahanBaku = async (data) => { 
    try { 
      const response = await useAxios.post("/bahan_baku", data, { 
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

const updateBahanBaku = async (data, id_bahan_baku) => { 
    try { 
      const response = await useAxios.put(`/bahan_baku/${id_bahan_baku}`, data, { 
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
  
  const deleteBahanBaku = async (id) => { 
      try { 
      const response = await useAxios.delete(`/bahan_baku/${id}`, { 
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

const APIBahanBaku = {
    getAllBahanBaku,
    getBahanBakuByPage,
    searchBahanBaku,
    createBahanBaku,
    updateBahanBaku,
    deleteBahanBaku,
};

export default APIBahanBaku;