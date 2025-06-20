// src/api/shared/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse, ApiErrorItem, ApiServiceErrorResponse } from '../interfaces/api-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    // Verificar si ya es una respuesta estandarizada
    if (this.isApiErrorResponse(exceptionResponse)) {
      // Es una respuesta ya formateada (probablemente de JoiValidationPipe)
      return response.status(status).json(exceptionResponse);
    }

    if (this.isApiServiceErrorResponse(exceptionResponse)) {
      // Es una respuesta ya formateada (probablemente de JoiValidationPipe)
      return response.status(status).json({
        status: 'error',
        message: exceptionResponse.error,
        errors: exceptionResponse.message,
      });
    }

    // Formar respuesta de error estandarizada para otros tipos de excepciones
    let message: string;
    let errors: ApiErrorItem[] = [];

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if ('message' in exceptionResponse) {
        const errorMsg = exceptionResponse['message'];
        message = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;

        // Si hay mensajes múltiples, convertirlos en formato de errores
        if (Array.isArray(errorMsg) && errorMsg.length > 1) {
          errors = errorMsg.map((msg, index) => ({
            code: `ERROR_${index}`,
            message: msg,
            field: 'unknown'
          }));
        }
      } else {
        message = exception.message;
      }
    } else {
      message = exception.message;
    }

    const errorResponse: ApiErrorResponse = {
      status: 'error',
      message,
      errors
    };

    response.status(status).json(errorResponse);
  }
    /**
     * Type Guard para verificar si un objeto es una respuesta ApiErrorResponse
     */
    private isApiErrorResponse(obj: any): obj is ApiErrorResponse {
        return obj !== null &&
                typeof obj === 'object' &&
                'status' in obj &&
                obj['status'] === 'error';
    }

    /**
     * Type Guard para verificar si un objeto es una respuesta ApiServiceErrorResponse
     */
    private isApiServiceErrorResponse(obj: any): obj is ApiServiceErrorResponse {
        return obj !== null &&
                typeof obj === 'object' &&
                'message' in obj &&
                'error' in obj &&
                typeof obj.error === 'string' &&
                'statusCode' in obj;
    }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Loguear el error completo para diagnóstico en servidor
    console.error('Error no controlado:', exception);
    
    if (exception.stack) {
      console.error('Stack trace:', exception.stack);
    }
    
    if (request.url) {
      console.error('URL que causó el error:', request.url);
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal application error';

    // Generar un código de error específico para diagnóstico
    const errorId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    
    const errorResponse: ApiErrorResponse = {
      status: 'error',
      message,
      errors: [{
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' ? 
          `Error interno (ID: ${errorId}): ${exception.message || 'Error desconocido'}` :
          `Internal application error (Error ID: ${errorId})`,
        field: 'unknown'
      }]
    };

    // En desarrollo, podemos agregar más detalles
    if (process.env.NODE_ENV === 'development') {
      (errorResponse as any).debug = {
        errorId,
        originalError: exception.message,
        stack: exception.stack,
      };
    }

    response.status(status).json(errorResponse);
  }
}


