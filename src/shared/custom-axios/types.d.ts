import 'axios'

declare module 'axios' {
   type NewAxiosResponse<T = any, D = any> = T
   interface AxiosInterceptorManager<V> {
      use(
         onFulfilled?: ((value: V) => NewAxiosResponse | Promise<NewAxiosResponse>) | null,
         onRejected?: ((error: any) => any) | null,
         options?: AxiosInterceptorOptions
      ): number
   }

   interface AxiosInstance {
      defaults: AxiosDefaults
      interceptors: {
         request: AxiosInterceptorManager<InternalAxiosRequestConfig>
         response: AxiosInterceptorManager<AxiosResponse>
      }
      request<T = any, R = NewAxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>
      get<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      delete<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      head<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      options<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      post<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         data?: D,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      put<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         data?: D,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      patch<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         data?: D,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      postForm<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         data?: D,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      putForm<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         data?: D,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
      patchForm<T = any, R = NewAxiosResponse<T>, D = any>(
         url: string,
         data?: D,
         config?: AxiosRequestConfig<D>
      ): Promise<R>
   }
}
